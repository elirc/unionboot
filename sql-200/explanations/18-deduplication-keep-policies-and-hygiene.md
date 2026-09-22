# Deduplication keep policies and hygiene — sql-200 Q171–Q180

**What you practise:** deciding what "the same row twice" means, choosing which copy survives, and expressing that choice as a window filter, a `GROUP BY`, a `DISTINCT` or a `DELETE`.
**Prerequisites:** [05 Ranking and top N per group](05-ranking-and-top-n-per-group.md) for `ROW_NUMBER` and the CTE-plus-filter pattern; [11 String normalization parsing and matching](11-string-normalization-parsing-and-matching.md) for `lower()`; `GROUP BY … HAVING`.
**Exercises:** Q171: keep-first-seen-per-email, Q172: keep-latest-seen-per-email, Q173: group-min-policy, Q174: delete-duplicates-keep-min-id, Q175: duplicate-emails-only, Q176: exact-duplicate-pairs, Q177: keep-latest-per-normalized-name, Q178: dedup-projection-only, Q179: delete-null-email-rows, Q180: dedup-count-before-after.

## The problem in plain words

Seven rows of imported contact data. Two of them are Ada with the same email in different name casing, two are Dee, one is Cy with no email at all, and one is `cy` with the email `CY@x.com` in capitals. Nothing is a byte-for-byte duplicate of anything else.

That is the first decision every deduplication has to make: **what is the key?** By raw `email`, `'CY@x.com'` and `'cy@x.com'` are different addresses. By `lower(email)` they are the same. By `(name,email)` as a pair, `'Ada'` and `'ada'` are different people. Each exercise fixes the key, and the answers change accordingly.

The second decision is the **keep policy**: which member of a duplicate group survives. First seen (lowest id), last seen (latest `seen_at`), or none of them — some exercises report the duplicates rather than removing them.

The third is **where the deduplication happens**. Filtering a query leaves the table alone (Q171, Q172, Q177). `DELETE` changes the stored data and the grader checks it (Q174, Q179). `GROUP BY` and `DISTINCT` collapse rows in the output and give you less to report with, because only the group key and aggregates remain (Q173, Q178).

NULL needs its own note, because two of its rules point in opposite directions. Under `GROUP BY` and `DISTINCT`, all NULLs are treated as one value and form a single group. Under `=`, two NULLs are not equal and the comparison is unknown. Q173, Q178 and Q180 rely on the first rule; Q179 relies on `IS NULL` because of the second.

## The contract you must honour

Eight of the ten exercises share this seed, quoted from `prompts/Q171.txt`:

```sql
CREATE TABLE raw(id INTEGER PRIMARY KEY,name TEXT,email TEXT,seen_at TEXT);
INSERT INTO raw VALUES(1,'Ada','ada@x.com','2024-01-01'),(2,'Bo','bo@x.com','2024-01-02'),
  (3,'ada','ada@x.com','2024-01-03'),(4,'Cy',NULL,'2024-01-04'),(5,'cy','CY@x.com','2024-01-05'),
  (6,'Dee','dee@x.com','2024-01-06'),(7,'dee','dee@x.com','2024-01-07');
```

Q176 and Q178 add one more row on top of it, which is what gives them an exact duplicate to find:

```sql
INSERT INTO raw VALUES(8,'Bo','bo@x.com','2024-01-08');
```

- `seen_at` is an ISO-8601 date string, so plain text ordering is chronological; no date function is needed.
- The only duplicates under `lower(email)` are `ada@x.com` (ids 1, 3) and `dee@x.com` (ids 6, 7). `CY@x.com` normalizes to `cy@x.com` but has no partner.
- Under `lower(name)` the pairs are different: Ada/ada, Cy/cy, Dee/dee — three groups of two, with Bo alone.
- Aliases: `id, email` (Q171, Q172, Q174, Q179); `email, first_id` (Q173); `email, copies` (Q175); `name, email, copies` (Q176); `id, name, email` (Q177); `name, email` (Q178); `duplicate_count, total_rows` (Q180).
- Row counts: Q171, Q172 and Q174 return 5; Q173 returns 5; Q175 returns 2; Q176 returns 1; Q177 returns 4; Q178 returns 7; Q179 returns 6; Q180 returns 1.
- Q171 expects `{"id":5,"email":"CY@x.com"}` — the *stored* spelling, because a whole row survives. Q173 expects `{"email":"cy@x.com","first_id":5}` — the *normalized* spelling, because the group key is what is reported.
- Q171 and Q173 both keep the NULL-email row: it forms a partition (Q171) and a group (Q173) of its own, and in Q173 it sorts first with `first_id` 4.
- Q172's survivors are ids 2, 3, 4, 5, 7 — the output is ordered by `id`, not by recency.
- Q177's survivors are 2, 3, 5, 7. Row 5 beats row 4 because it is more recent, so the surviving Cy row has an email where the first-seen policy would have kept the one without.
- Q178's expected order is `Ada, Bo, Cy, Dee, ada, cy, dee`: every upper-case letter sorts before every lower-case one under the default `BINARY` collation.
- Q180 expects `{"duplicate_count":2,"total_rows":7}`: 7 rows minus 5 distinct normalized emails, where the NULL group counts as one of the five.

## Approach

1. **Write down the key before writing SQL.** `lower(email)`, `lower(name)`, `(name,email)` and `email IS NULL` are four different keys in this family and each gives different answers.
2. **To keep a whole row, rank inside the group and filter on the rank.** `ROW_NUMBER() OVER (PARTITION BY <key> ORDER BY <policy>)` then `WHERE n = 1` in the enclosing query, because a window function cannot appear in `WHERE`.
3. **Set the window's `ORDER BY` from the keep policy.** `ORDER BY id` keeps the first seen; `ORDER BY seen_at DESC, id DESC` keeps the last seen, with a tiebreak so equal timestamps do not make the result arbitrary.
4. **To report a summary rather than a row, use `GROUP BY`** with `MIN(id)`, `COUNT(*)` and so on. Remember that you can then only report the key and aggregates.
5. **To find duplicates rather than remove them, add `HAVING COUNT(*) > 1`.**
6. **To deduplicate the projection, use `DISTINCT`** — the unit of uniqueness becomes exactly the columns you selected.
7. **To clean the table, `DELETE` the rows that are not the survivors.** `WHERE id NOT IN (SELECT MIN(id) FROM … GROUP BY key)` is safe because `MIN(id)` over a non-empty group is never NULL.
8. **Exclude or include NULL deliberately.** `WHERE email IS NOT NULL` before grouping removes it from the report; leaving it in makes it one group.

## Worked example — Q171 keep-first-seen-per-email

The task, quoted from the prompt: "Keep the lowest-id row per normalized lowercase email; NULL emails are already distinct by id. Return id,email ordered by id."

**Step 1 — `FROM raw`, with the partition key computed.**

| id | email | `lower(email)` |
| --- | --- | --- |
| 1 | `'ada@x.com'` | `'ada@x.com'` |
| 2 | `'bo@x.com'` | `'bo@x.com'` |
| 3 | `'ada@x.com'` | `'ada@x.com'` |
| 4 | NULL | NULL |
| 5 | `'CY@x.com'` | `'cy@x.com'` |
| 6 | `'dee@x.com'` | `'dee@x.com'` |
| 7 | `'dee@x.com'` | `'dee@x.com'` |

**Step 2 — `PARTITION BY lower(email)`.** Five partitions. Window partitioning groups all NULLs together, so row 4 sits in a partition of its own — here that partition happens to have one member.

| partition | rows |
| --- | --- |
| NULL | 4 |
| `ada@x.com` | 1, 3 |
| `bo@x.com` | 2 |
| `cy@x.com` | 5 |
| `dee@x.com` | 6, 7 |

**Step 3 — `ORDER BY id` inside each partition, and number the rows.** This is the walking order the policy defines, not the output order.

| id | partition | n |
| --- | --- | --- |
| 1 | ada | 1 |
| 3 | ada | 2 |
| 2 | bo | 1 |
| 4 | NULL | 1 |
| 5 | cy | 1 |
| 6 | dee | 1 |
| 7 | dee | 2 |

**Step 4 — `WHERE n = 1` in the outer query.** Rows 3 and 7 are dropped. The filter lives outside the CTE because a window function is computed after `WHERE` has already run.

**Step 5 — `SELECT id, email` and `ORDER BY id`.** Note that `email` is the stored value, so row 5 reports `'CY@x.com'` and not the normalized key.

| id | email |
| --- | --- |
| 1 | `ada@x.com` |
| 2 | `bo@x.com` |
| 4 | `null` |
| 5 | `CY@x.com` |
| 6 | `dee@x.com` |

`tests/Q171.cjs` asserts exactly those five rows.

The reference solution, as it now reads in `solutions/Q171.sql`:

```sql
-- Why this works:
-- ROW_NUMBER() OVER (PARTITION BY lower(email) ORDER BY id) numbers the
-- rows inside each group of equal normalized emails, lowest id first, so
-- n=1 is the first-seen row of each group.
-- Partitioning by an expression is allowed, and lower() is what makes
-- 'CY@x.com' and 'cy@x.com' the same group - here only ada and dee actually
-- repeat.
-- lower(NULL) is NULL, and window partitioning treats all NULLs as one
-- partition, so row 4 is alone in it and survives with n=1.
-- The filter is in the outer query because a window function may not appear
-- in WHERE.
WITH r AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY lower(email) ORDER BY id) AS n
  FROM raw
)
SELECT id, email
FROM r
WHERE n = 1
ORDER BY id;
```

**The Q171/Q172/Q173 contrast.** Q172 changes one clause — the window's `ORDER BY` becomes `seen_at DESC, id DESC` — and the survivors move from 1, 2, 4, 5, 6 to 2, 3, 4, 5, 7. Q173 answers the same "first per group" question with `GROUP BY lower(email)` and `MIN(id)`, and gets the same ids; what it loses is the stored spelling, because after grouping only the key and the aggregates exist.

## Policy matrix — what changes between the variants

| ID | Variant | Key | Keep policy | What changes in the SQL |
| --- | --- | --- | --- | --- |
| Q171 | keep-first-seen-per-email | `lower(email)` | lowest id | `ROW_NUMBER() … ORDER BY id`, `WHERE n=1` |
| Q172 | keep-latest-seen-per-email | `lower(email)` | latest `seen_at` | the window's `ORDER BY` becomes `seen_at DESC, id DESC` |
| Q173 | group-min-policy | `lower(email)` | lowest id, reported | `GROUP BY lower(email)` with `MIN(id)` instead of a window |
| Q174 | delete-duplicates-keep-min-id | `lower(email)` | lowest id, enforced | `DELETE … WHERE id NOT IN (SELECT MIN(id) … GROUP BY …)` |
| Q175 | duplicate-emails-only | `lower(email)` | none — report the groups | `HAVING COUNT(*)>1`, `WHERE email IS NOT NULL` |
| Q176 | exact-duplicate-pairs | `(name,email)` raw | none — report the groups | `GROUP BY name,email` with no `lower()` |
| Q177 | keep-latest-per-normalized-name | `lower(name)` | latest `seen_at` | the partition key changes from email to name |
| Q178 | dedup-projection-only | the selected columns | one row per distinct pair | `SELECT DISTINCT name,email` |
| Q179 | delete-null-email-rows | — | remove missing emails | `DELETE … WHERE email IS NULL` |
| Q180 | dedup-count-before-after | `lower(email)` | none — count the excess | `COUNT(*)` minus a subquery counting the groups |

## Pitfalls the tests are designed to catch

- **Partitioning by `email` instead of `lower(email)`.** With the raw column, `CY@x.com` is its own group anyway, so Q171 returns the same five rows and the mistake hides. It would not hide if the seed had a second `cy` row — and Q175's counts would change.
- **Reporting the normalized key where the stored value is expected.** Q171 asserts `"email":"CY@x.com"`. `SELECT id, lower(email)` returns `"cy@x.com"` and fails.
- **Expecting the stored value out of a `GROUP BY`.** Q173 asserts `"email":"cy@x.com"`; the raw spelling is no longer available after grouping, which is the trade-off the exercise is about.
- **Dropping the tiebreak from a latest-wins window.** Q172 and Q177 both order by `seen_at DESC, id DESC`. The dates are distinct in this seed, so the test passes without the second key — and the query becomes non-deterministic the first time two rows share a timestamp.
- **Ordering the output by the policy.** Q172's rows come back ordered by `id`, not by `seen_at`; the window's order and the statement's order are separate clauses.
- **Filtering on a window function.** `WHERE ROW_NUMBER() OVER (…) = 1` is an error. The rank must be produced in a CTE or subquery and filtered outside it.
- **`NOT IN` with a NULL-producing subquery in Q174.** Here the list is `MIN(id)` per group, which can never be NULL, so it is safe. Had the subquery selected a nullable column, every comparison would be unknown and the `DELETE` would remove nothing.
- **Deleting the NULL-email row in Q174.** It is its own group, so its `MIN(id)` of 4 is in the keep list and the row survives. The expected result includes `{"id":4,"email":null}`.
- **`WHERE email = NULL` in Q179.** Unknown for every row, so nothing is deleted and seven rows come back instead of six.
- **Normalizing in Q176.** The exercise is explicitly about byte-exact pairs: `'Ada'` and `'ada'` are different. Adding `lower()` would collapse them and produce three groups where one is expected.
- **Using `COUNT(email)` instead of `COUNT(*)`.** `COUNT(expr)` skips NULLs, so the NULL group would count 0 and a `HAVING` test would behave differently. Q175 sidesteps it with a `WHERE`, and Q180 depends on `COUNT(*)` counting all seven rows.
- **Counting distinct emails with `COUNT(DISTINCT lower(email))` in Q180.** That form skips NULL and returns 4, giving a `duplicate_count` of 3. The expected 2 requires the NULL group to count as one distinct value, which is what the `GROUP BY` subquery does.
- **Sorting Q178 case-insensitively.** The asserted order puts `Ada, Bo, Cy, Dee` before `ada, cy, dee`; `ORDER BY name COLLATE NOCASE` would interleave them.

## Try it yourself

1. Add row 8 (`'Bo','bo@x.com'`) to the Q171 seed and predict which of Q171, Q173, Q175 and Q180 change their output.
2. Rewrite Q174 using `ROW_NUMBER` instead of `NOT IN`, deleting the rows whose rank is greater than 1. (Hint: SQLite has no `DELETE … USING`, so the rank has to be computed in a subquery that yields ids.)
3. Write "keep the row with the longest name per normalized email, lowest id on ties". Which clause of Q171 changes, and by how much?
4. In words: Q171 and Q173 return the same ids and different email values. Explain what a `GROUP BY` throws away that a window function keeps, and give a case where that loss would matter.

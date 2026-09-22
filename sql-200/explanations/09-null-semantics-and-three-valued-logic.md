# NULL semantics and three valued logic — sql-200 Q081–Q090

**What you practise:** reasoning about NULL as a third truth value, replacing it deliberately with `COALESCE`/`NULLIF`, and writing the predicates that give you NULL-safe equality and inequality.
**Prerequisites:** [04 Subqueries correlated lookups and existence](04-subqueries-correlated-lookups-and-existence.md) for `NOT IN` versus `NOT EXISTS`; [08 Set operations and membership policies](08-set-operations-and-membership-policies.md) for how set operators treat NULL differently.
**Exercises:** Q081: coalesce-missing-numeric, Q082: nullif-safe-real-ratio, Q083: blank-and-null-label-fallback, Q084: not-equal-excludes-unknown, Q085: not-equal-or-unknown, Q086: null-safe-equality-emulation, Q087: is-distinct-emulation, Q088: not-in-null-filter-and-known-left, Q089: three-valued-or-truth-table, Q090: count-null-and-zero-separately.

## The problem in plain words

NULL is not a value. It is a marker meaning "there is no value here", and every operation that touches it has to decide what that means.

SQL's answer is **three-valued logic**. A comparison returns true, false, or *unknown*, and any comparison involving NULL returns unknown. `WHERE` keeps only rows whose predicate is true, so unknown behaves like false there — but `NOT unknown` is still unknown, not true, which is why negating a filter does not partition the rows into two halves. Q084 and Q085 are that fact, expressed twice.

The `OR` and `AND` operators extend to three values in the obvious way: `unknown OR true` is true, because whatever the unknown turns out to be, the result is true. `unknown OR false` is unknown. `unknown AND false` is false. Q089 prints those results as SQLite reports them — `1`, `0` and NULL — because SQLite has no separate boolean type and stores booleans as integers.

The family's other half is about *replacing* NULL on purpose. `COALESCE(x, y, …)` returns the first argument that is not NULL. `NULLIF(x, y)` returns NULL when `x = y` and `x` otherwise — the inverse operation, used to turn a sentinel such as `0` or `''` into a genuine NULL. Q082 and Q083 combine them.

Two exercises ask you to build operators SQLite does not give you as a single keyword: null-safe equality (Q086) and "is distinct from" (Q087). Both are written out as explicit `OR` chains.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q081.txt`:

```sql
CREATE TABLE measures(id INTEGER PRIMARY KEY,a INTEGER,b INTEGER,label TEXT);
INSERT INTO measures VALUES(1,10,2,'ok'),(2,NULL,2,NULL),(3,5,0,''),
  (4,NULL,NULL,'missing'),(5,0,0,'zero'),(6,3,NULL,NULL);
CREATE TABLE excluded(value INTEGER); INSERT INTO excluded VALUES(5),(NULL);
```

Six rows covering every interesting combination:

| id | a | b | label | note |
| --- | --- | --- | --- | --- |
| 1 | 10 | 2 | `'ok'` | everything known |
| 2 | NULL | 2 | NULL | left unknown |
| 3 | 5 | 0 | `''` | zero denominator, empty string |
| 4 | NULL | NULL | `'missing'` | both unknown |
| 5 | 0 | 0 | `'zero'` | zero is a value, not a NULL |
| 6 | 3 | NULL | NULL | right unknown |

- `0` and `''` are ordinary values. Q081 expects `{"id":5,"value":0}`, so `COALESCE` must not be confused with "replace falsy". Q083 expects row 3 to become `'unknown'`, which takes an explicit `NULLIF(label,'')` first.
- `excluded` contains `5` and a NULL. Q088's prompt says "filter NULL out of the subquery and exclude unknown left values" — without both guards the answer is wrong in two different ways.
- Q084 expects ids `1, 5, 6` — three rows. `a <> 5` is true for 10, 0 and 3; unknown for the two NULLs; false for row 3.
- Q085 expects ids `1, 2, 4, 5, 6` — five rows, adding the two NULL rows via an explicit `OR a IS NULL`.
- Q086 expects ids `4, 5`: row 5 because `0 = 0`, row 4 because both are NULL and the prompt calls that equal.
- Q087 expects ids `1, 2, 3, 6`: differing values, plus the two rows where exactly one side is NULL. Rows 4 and 5 are "not distinct" and are excluded.
- Q089 expects `1, 1, 1, null, 0, null`. Row 2 is `1` because `unknown OR (2=2)` is true. Row 6 is `null` because `(3=5) OR unknown` is `false OR unknown`, which is unknown.
- Q090 returns a single row with `missing: 2, zeros: 1, known: 4`, and no `GROUP BY` — an aggregate query with no grouping produces exactly one row.
- Aliases: `id, value` (Q081); `id, ratio` (Q082); `id, label` (Q083); `id` (Q084–Q087); `id, a` (Q088); `id, truth` (Q089); `missing, zeros, known` (Q090).
- Every exercise except Q090 orders by `id`.

## Approach

1. **Decide whether NULL should be replaced or reasoned about.** "NULL becomes -1" is `COALESCE`. "Rows where a is unknown" is `IS NULL`. They are different jobs.
2. **`COALESCE(x, fallback)` returns `x` unless `x` is NULL.** It does not treat `0` or `''` as missing; that is what makes Q081 and Q083 different exercises.
3. **`NULLIF(x, sentinel)` converts a sentinel into NULL.** `NULLIF(b, 0)` makes a zero denominator NULL, and any arithmetic on NULL yields NULL, which is a safe divide. `NULLIF(label,'')` makes an empty string NULL so that `COALESCE` can then supply a fallback.
4. **Force real division before dividing.** `1.0 * a / NULLIF(b,0)` — the `1.0` promotes the expression so `10/2` is `5.0` rather than an integer, matching the prompt's "real arithmetic".
5. **Add `OR x IS NULL` when unknown rows must be included.** `<>` alone never admits them, however the filter is negated.
6. **Write null-safe equality as `a = b OR (a IS NULL AND b IS NULL)`.** SQLite also has `IS` for this (`a IS b` is a null-safe comparison), but the prompt says "emulate … explicitly", so the reference spells it out.
7. **Write "is distinct from" as the three ways two values can differ:** both known and unequal, left NULL with right known, left known with right NULL.
8. **Guard `NOT IN` on both ends.** Filter NULL out of the subquery, because one NULL in the list makes every `NOT IN` test unknown; and test the outer column for `IS NOT NULL`, because a NULL on the left is unknown against any list.
9. **Count categories with `SUM(CASE …)`.** `SUM(CASE WHEN cond THEN 1 ELSE 0 END)` counts rows satisfying a condition; `COUNT(col)` counts non-NULL values. Q090 uses both.

## Worked example — Q081 coalesce-missing-numeric

The task: "Return a with NULL replaced by -1; zero remains zero."

**Step 1 — FROM measures.** All six rows; there is no `WHERE`, so every id must appear in the output.

**Step 2 — evaluate `COALESCE(a, -1)` per row.** `COALESCE` scans its arguments left to right and returns the first that is not NULL.

| id | a | `COALESCE(a,-1)` | why |
| --- | --- | --- | --- |
| 1 | 10 | 10 | first argument is not NULL |
| 2 | NULL | -1 | first argument is NULL, fall through |
| 3 | 5 | 5 | not NULL |
| 4 | NULL | -1 | fall through |
| 5 | 0 | **0** | `0` is not NULL, so it is returned unchanged |
| 6 | 3 | 3 | not NULL |

Row 5 is the one the prompt calls out. In many programming languages `0 || -1` or `0 ?: -1` would yield `-1` because zero is falsy. SQL has no falsiness here: `COALESCE` tests only for NULL.

**Step 3 — SELECT id, … AS value.** The alias `value` is required; without it the column would be named after the `COALESCE` expression text.

**Step 4 — ORDER BY id.** Ids 1 through 6.

The asserted rows in `tests/Q081.cjs`:

```sql
-- [{"id":1,"value":10},{"id":2,"value":-1},{"id":3,"value":5},
--  {"id":4,"value":-1},{"id":5,"value":0},{"id":6,"value":3}]
```

The reference solution, as it now reads in `solutions/Q081.sql`:

```sql
-- Why this works:
-- COALESCE returns its first argument that is not NULL, so a known value
-- passes through untouched and an unknown one becomes -1.
-- The test it applies is strictly "is this NULL", not "is this falsy": row 5
-- holds the value 0, which is a perfectly good number, so it is returned as
-- 0 rather than being replaced.
-- No WHERE clause, because every row must appear in the output.
SELECT id,
       COALESCE(a, -1) AS value
FROM measures
ORDER BY id;
```

**The Q084/Q085 contrast, the family's central point.** `WHERE a <> 5` evaluates per row:

| id | a | `a <> 5` | Q084 keeps | Q085 keeps |
| --- | --- | --- | --- | --- |
| 1 | 10 | true | yes | yes |
| 2 | NULL | unknown | no | yes (via `OR a IS NULL`) |
| 3 | 5 | false | no | no |
| 4 | NULL | unknown | no | yes |
| 5 | 0 | true | yes | yes |
| 6 | 3 | true | yes | yes |

Three rows versus five. Note what this means: `WHERE a = 5` returns one row and `WHERE a <> 5` returns three, and one plus three is four, not six. The two NULL rows belong to neither. That non-partitioning is the practical consequence of three-valued logic, and it is where most NULL bugs come from.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q081 | coalesce-missing-numeric | "NULL replaced by -1; zero remains zero" | `COALESCE(a,-1)` |
| Q082 | nullif-safe-real-ratio | "real arithmetic and NULLIF for zero denominators" | `1.0*a/NULLIF(b,0)` |
| Q083 | blank-and-null-label-fallback | "both empty labels and NULL labels to unknown" | `COALESCE(NULLIF(label,''),'unknown')` — both functions, nested |
| Q084 | not-equal-excludes-unknown | "unknown comparisons must remain excluded" | plain `WHERE a<>5` |
| Q085 | not-equal-or-unknown | "different from 5 or NULL" | `WHERE a<>5 OR a IS NULL` |
| Q086 | null-safe-equality-emulation | "equal including both-NULL as equal" | `a=b OR (a IS NULL AND b IS NULL)` |
| Q087 | is-distinct-emulation | "differ, exactly one NULL as distinct" | `a<>b OR (a IS NULL AND b IS NOT NULL) OR (a IS NOT NULL AND b IS NULL)` |
| Q088 | not-in-null-filter-and-known-left | "filter NULL out of the subquery and exclude unknown left values" | `a IS NOT NULL AND a NOT IN(SELECT value … WHERE value IS NOT NULL)` |
| Q089 | three-valued-or-truth-table | "show the SQLite result of (a=5 OR b=2)" | the predicate moves into the select list: `(a=5 OR b=2) AS truth` |
| Q090 | count-null-and-zero-separately | "one summary row counting NULL a, zero a, and all known a" | three aggregates, no `GROUP BY` |

## Pitfalls the tests are designed to catch

- **Treating `0` or `''` as missing.** Q081 expects row 5 to stay `0`, and Q083 needs `NULLIF(label,'')` to turn row 3's empty string into a NULL before `COALESCE` can replace it. `COALESCE(label,'unknown')` alone leaves row 3 as `''`.
- **`a = NULL` instead of `a IS NULL`.** The first is always unknown and matches nothing. Only `IS NULL` / `IS NOT NULL` inspect the marker.
- **Expecting `WHERE a<>5` to be the complement of `WHERE a=5`.** It is not: the NULL rows satisfy neither. Q084 and Q085 differ by exactly those two rows.
- **Dividing by a raw zero.** SQLite returns NULL for `x/0` rather than raising an error, so Q082 would coincidentally produce the same rows without `NULLIF`. The prompt asks for `NULLIF` because it states the intent, and because a zero denominator and a missing denominator then produce the same explicit NULL.
- **Integer division in Q082.** `a/NULLIF(b,0)` with integer operands truncates. The expected `{"id":1,"ratio":5}` happens to be exact, but `1.0 *` is what makes the arithmetic real, as the prompt requires.
- **Unfiltered `NOT IN` in Q088.** `excluded` contains a NULL, so `a NOT IN (SELECT value FROM excluded)` is unknown for every row and the result is empty. This is the same trap as Q034, and here the prompt spells out both halves of the fix.
- **Forgetting the left-hand guard in Q088.** Even with a NULL-free list, `NULL NOT IN (5)` is unknown, so rows 2 and 4 would be excluded anyway — but the expected `a` column would then need to hold NULLs if they were not. `a IS NOT NULL` makes the intent explicit and matches "exclude unknown left values".
- **Wrapping Q089's expression in `CASE` or `COALESCE`.** The exercise exists to show SQLite's raw output: `1`, `0` and NULL. Converting NULL to `0` would break rows 4 and 6.
- **Expecting a boolean type in Q089.** SQLite has none; true and false are the integers `1` and `0`, and `node:sqlite` hands them to JavaScript as numbers. The expected rows use `1`/`0`, not `true`/`false`.
- **`COUNT(*)` where `COUNT(a)` is meant in Q090.** `COUNT(*)` is 6, `COUNT(a)` is 4. The `known` column asks for the second.
- **`COUNT(CASE WHEN a=0 THEN 1 ELSE 0 END)` in Q090.** `COUNT` counts non-NULL results, and `0` is not NULL, so that expression returns 6. `SUM(CASE … THEN 1 ELSE 0 END)` is the counting idiom that works. Alternatively `COUNT(CASE WHEN a=0 THEN 1 END)`, with no `ELSE`, yields NULL for non-matches and counts correctly.
- **Assuming `SUM(CASE WHEN a IS NULL …)` could be `SUM(a IS NULL)`.** It could, in SQLite, because the comparison yields `1`/`0` — but that relies on booleans-as-integers and does not port. The reference uses the explicit `CASE`.

## Try it yourself

1. Rewrite Q086 using SQLite's `IS` operator (`a IS b`). Confirm the same two rows come back, then say why the prompt asked for the long form.
2. Add a row `(7, 5, 5, NULL)` and predict how Q084, Q085, Q086 and Q087 each change.
3. Write "rows where `a` is distinct from 5", treating NULL as distinct. How does it relate to Q085?
4. In words: `WHERE a = 5` returns one row and `WHERE a <> 5` returns three, out of six. Explain where the other two went, and name a clause that would put them back.

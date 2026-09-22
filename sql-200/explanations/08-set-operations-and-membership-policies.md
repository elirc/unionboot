# Set operations and membership policies — sql-200 Q071–Q080

**What you practise:** `UNION`, `UNION ALL`, `INTERSECT` and `EXCEPT`, how each one treats duplicates and NULL, and why a join is not a set operator.
**Prerequisites:** [01 Join preservation and matching](01-join-preservation-and-matching.md); `GROUP BY` with `COUNT`; `ORDER BY` on a compound statement.
**Exercises:** Q071: union-distinct-including-null, Q072: union-all-retain-multiplicity, Q073: intersect-including-null, Q074: except-spring-minus-autumn, Q075: except-autumn-minus-spring, Q076: symmetric-difference, Q077: intersect-known-names-only, Q078: union-all-source-tagged, Q079: multiset-count-after-union-all, Q080: join-is-not-intersect-multiplicity.

## The problem in plain words

Two one-column tables hold cohort rosters. `spring` has `Ada, Bo, Bo, Cy, NULL`; `autumn` has `Bo, Dee, NULL, NULL`. Duplicates and NULLs are deliberate, because the whole family is about what each operator does with them.

A **set operator** combines the rows of two `SELECT`s that have the same number of columns. There are four:

| Operator | Meaning | Duplicates |
| --- | --- | --- |
| `UNION` | rows in either side | removed |
| `UNION ALL` | rows in either side | kept |
| `INTERSECT` | rows in both sides | removed |
| `EXCEPT` | rows in the left side that are not in the right | removed |

Three of the four deduplicate. That is the single most common surprise: `UNION` is not "concatenate", it is "concatenate then `DISTINCT`".

The second surprise is NULL. Everywhere else in SQL, `NULL = NULL` is unknown — that is why family 01's `LEFT JOIN` never matches a NULL foreign key. Set operators are the exception: they compare rows using *not-distinct* semantics, under which two NULLs count as the same value. So `UNION` collapses spring's one NULL and autumn's two NULLs into a single NULL row (Q071), and `INTERSECT` reports NULL as a shared member (Q073). If you want NULL excluded, you have to say so (Q077).

The third point is that a join is not `INTERSECT`. Both can answer "which names are in both tables", but a join multiplies: spring's two `Bo` rows meet autumn's one, producing two rows. Q073 and Q080 are the same question asked of the two tools, and their expected results differ in row count.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q071.txt`:

```sql
CREATE TABLE spring(name TEXT); CREATE TABLE autumn(name TEXT);
INSERT INTO spring VALUES('Ada'),('Bo'),('Bo'),('Cy'),(NULL);
INSERT INTO autumn VALUES('Bo'),('Dee'),(NULL),(NULL);
```

- Neither table has a key. `spring` has 5 rows, `autumn` has 4; nine rows in total, which is Q072's expected count.
- `Bo` appears twice in `spring` and once in `autumn`. NULL appears once in `spring` and twice in `autumn`.
- NULL sorts **first** under SQLite's ascending `ORDER BY`. Q071's expected first row is `{"name":null}` and Q072's first three rows are all `null`.
- Q071 returns 5 rows: one NULL plus `Ada, Bo, Cy, Dee`. Q072 returns all 9.
- Q073 returns `null` and `Bo` — the prompt words it as "including their shared NULL". Q077 is the same question with `WHERE name IS NOT NULL` on both sides and returns `Bo` alone.
- Q074 (`spring EXCEPT autumn`) returns `Ada, Cy` — **not** NULL, because NULL is present in `autumn` and `EXCEPT` removes it under the same not-distinct rule. Q075 (`autumn EXCEPT spring`) returns `Dee` alone.
- Q076 asks for the symmetric difference "using two EXCEPT sets combined with UNION; parenthesize via CTEs". Set operators in SQLite associate left to right with equal precedence, so `A EXCEPT B UNION C EXCEPT D` does not mean what the parentheses suggest; naming each half in a CTE is how the reference makes the grouping explicit.
- Q078 returns 5 rows of `name, source`. "Deduplicate inside each cohort" means `SELECT DISTINCT` on each branch; `UNION ALL` then keeps `Bo` once per source, giving two `Bo` rows with different `source` values.
- Q079 expects `{"name":null,"occurrences":3}`. `GROUP BY` also treats NULLs as one group, so the three NULLs form a single bucket — and `COUNT(*)`, not `COUNT(name)`, is what reports 3 there.
- Q080 expects two identical `{"name":"Bo"}` rows. That is the join's fan-out, and it is the point of the exercise.
- Every exercise ends in `ORDER BY`. On a compound statement the `ORDER BY` belongs to the whole compound and is written once, after the last branch.

## Approach

1. **Match the operator to the wording.** "in either" → `UNION`; "without deduplication" / "combine" → `UNION ALL`; "shared by both" → `INTERSECT`; "only in X" → `X EXCEPT Y`.
2. **Remember that the direction of `EXCEPT` matters.** Q074 and Q075 are the same two tables in the opposite order and return different rows; `INTERSECT` and `UNION` are symmetric, `EXCEPT` is not.
3. **Add `WHERE name IS NOT NULL` when NULL must not participate.** There is no operator variant for this; it is an ordinary filter applied to each branch before the operator sees it (Q077, Q078).
4. **Wrap each half of a compound compound in a CTE.** Q076 builds `a` (spring minus autumn) and `b` (autumn minus spring), then `SELECT name FROM a UNION SELECT name FROM b`.
5. **Use `SELECT DISTINCT` inside a branch to dedupe that branch only.** Q078 needs `Bo` once per source, which is per-branch deduplication; a whole-statement `UNION` would also merge across branches, and the `source` column happens to keep them apart — but `DISTINCT` on each branch states the intent.
6. **Tag the source with a literal column.** `'spring' AS source` produces a constant column, which is how two structurally identical branches stay distinguishable.
7. **Count a multiset by folding it into a CTE and grouping.** Q079 unions all nine rows into `both`, then `GROUP BY name`.
8. **Use a join, not `INTERSECT`, when multiplicity is wanted.** Q080's `JOIN autumn a ON s.name = a.name` deliberately produces one row per matching pair. Note that the join's `=` uses ordinary three-valued logic, so the NULLs match nothing and no explicit filter is needed.

## Worked example — Q071 union-distinct-including-null

The task: "Return distinct names in either cohort, NULL first then alphabetical. UNION treats duplicate NULLs as one set member."

**Step 1 — the two branches.** Each is an ordinary `SELECT`, producing its table's rows in no particular order.

| `SELECT name FROM spring` | `SELECT name FROM autumn` |
| --- | --- |
| Ada | Bo |
| Bo | Dee |
| Bo | NULL |
| Cy | NULL |
| NULL | |

**Step 2 — concatenate.** Nine rows, which is exactly what `UNION ALL` would return and what Q072 expects.

```text
Ada, Bo, Bo, Cy, NULL, Bo, Dee, NULL, NULL
```

**Step 3 — deduplicate.** This is the step `UNION` adds. Rows are compared as whole rows under not-distinct semantics, so the three `Bo`s collapse to one and the three NULLs collapse to one.

| value | occurrences before | after |
| --- | --- | --- |
| NULL | 3 | 1 |
| Ada | 1 | 1 |
| Bo | 3 | 1 |
| Cy | 1 | 1 |
| Dee | 1 | 1 |

Five rows. The NULL collapse is the part worth pausing on: under the `=` operator used by `WHERE` and `JOIN`, `NULL = NULL` is unknown and would never match. Set operators use a different comparison, and this exercise exists to show it.

**Step 4 — ORDER BY name.** One `ORDER BY` for the whole compound, written after the second branch. SQLite sorts NULL before every non-NULL value in ascending order, and the four names sort by their `BINARY` byte order, which for these ASCII capitals is alphabetical.

| name |
| --- |
| NULL |
| Ada |
| Bo |
| Cy |
| Dee |

The asserted rows in `tests/Q071.cjs`:

```sql
-- [{"name":null},{"name":"Ada"},{"name":"Bo"},{"name":"Cy"},{"name":"Dee"}]
```

The reference solution, as it now reads in `solutions/Q071.sql`:

```sql
-- Why this works:
-- UNION concatenates the two branches and then removes duplicate rows, so
-- Bo's three occurrences collapse to one.
-- Set operators compare rows with not-distinct semantics, under which two
-- NULLs count as the same value. That is why the three NULLs become one row,
-- even though NULL = NULL is unknown everywhere else in SQL.
-- The ORDER BY belongs to the whole compound and is written once, after the
-- final branch. SQLite sorts NULL before every non-NULL value ascending,
-- which gives the NULL-first order the prompt asks for.
SELECT name FROM spring
UNION
SELECT name FROM autumn
ORDER BY name;
```

**The Q073/Q080 contrast.** `INTERSECT` asks "is this value in both sets" and answers once per distinct value: `NULL, Bo` — two rows. The join asks "which pairs match" and answers once per pair: spring's two `Bo` rows each match autumn's one, giving `Bo, Bo` — two rows that happen to be identical, and NULL absent because `=` never matches it. Same question, two tools, two different meanings of "two rows".

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q071 | union-distinct-including-null | "distinct names in either cohort" | `UNION` |
| Q072 | union-all-retain-multiplicity | "without deduplication" | `UNION ALL` |
| Q073 | intersect-including-null | "shared by both … including their shared NULL" | `INTERSECT` |
| Q074 | except-spring-minus-autumn | "spring-only names" | `spring EXCEPT autumn` |
| Q075 | except-autumn-minus-spring | "autumn-only names" | the same operator with the branches swapped |
| Q076 | symmetric-difference | "exactly one cohort … parenthesize via CTEs" | two `EXCEPT` CTEs combined with `UNION` |
| Q077 | intersect-known-names-only | "explicitly excluding NULL before intersection" | `WHERE name IS NOT NULL` on both branches of Q073 |
| Q078 | union-all-source-tagged | "known name/source pairs (deduplicate inside each cohort)" | `SELECT DISTINCT name,'spring' AS source … UNION ALL …` |
| Q079 | multiset-count-after-union-all | "count occurrences … preserving NULL as its own group" | CTE of `UNION ALL`, then `GROUP BY name` with `COUNT(*)` |
| Q080 | join-is-not-intersect-multiplicity | "retaining duplicate match pairs rather than INTERSECT" | an inner `JOIN ON s.name=a.name` instead of a set operator |

## Pitfalls the tests are designed to catch

- **Expecting `UNION` to preserve duplicates.** Q071 returns 5 rows from 9 input rows. If you want all nine, the operator is `UNION ALL` (Q072).
- **Expecting NULL to disappear from a set operator.** It does not. Q071 and Q073 both include a NULL row, and Q074 *loses* NULL precisely because `EXCEPT` matched it against autumn's NULLs.
- **Assuming `EXCEPT` is symmetric.** Q074 returns `Ada, Cy`; Q075 returns `Dee`. Swapping the branches is the entire difference.
- **Writing `ORDER BY` on a branch.** In a compound statement the sort belongs to the result, not to a branch; SQLite accepts only one, after the last `SELECT`. A branch-level `ORDER BY` is a syntax error there.
- **Naming the compound's columns after the wrong branch.** A compound takes its output column names from the first `SELECT`, so `ORDER BY name` refers to that branch's alias. SQLite is lenient about a table-qualified form such as `ORDER BY spring.name` and accepts it here, but the plain name is what the compound actually exposes and is the portable way to write it.
- **Relying on left-to-right grouping in Q076.** `A EXCEPT B UNION C EXCEPT D` evaluates strictly left to right in SQLite, with no precedence between the operators, so it does not compute a symmetric difference. The prompt says to parenthesize via CTEs, and naming both halves is what makes the intent readable as well as correct.
- **Using `UNION` in Q078.** The `source` column already differs between the branches, so `UNION` would return the same five rows — but it deduplicates across branches, which is not what "deduplicate inside each cohort" asks for. `SELECT DISTINCT` per branch plus `UNION ALL` says it exactly.
- **`COUNT(name)` in Q079.** The NULL bucket has three rows but zero non-NULL values, so `COUNT(name)` reports `0` where the expected row says `3`. `COUNT(*)` counts rows.
- **Assuming `GROUP BY` splits NULLs.** It does not — like the set operators, it groups NULLs together, which is why Q079 has one NULL bucket rather than three.
- **Using `INTERSECT` for Q080.** It returns one `Bo`; the expected result has two. The join's fan-out is the requirement, not a bug.
- **Expecting the join in Q080 to return a NULL row.** `ON s.name = a.name` uses ordinary equality, so NULL matches nothing. No `IS NOT NULL` filter is needed.
- **Assuming text sorts case-insensitively.** SQLite's default collation is `BINARY`, so `'bo'` would sort after `'Dee'`. Every name in this seed is capitalised, so it does not show here.

## Try it yourself

1. Add `('ada')` in lowercase to `autumn` and predict what Q071 returns, in both row count and order.
2. Write Q073 with `EXISTS` instead of `INTERSECT`. What extra work do you have to do to keep the NULL row?
3. Rewrite Q076 without CTEs, using `INTERSECT` and `UNION` on the same two tables. Is there a shorter expression for "in exactly one cohort"?
4. In words: Q073 and Q080 both return two rows, but for different reasons. Describe a change to the seed that would make their row counts differ.

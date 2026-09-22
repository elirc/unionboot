# sql-200 explanations — Q001 to Q200

Twenty families of ten scenarios. Each family shares one seed schema, and the ten scenarios vary one decision at a time: an inner join becomes a left join, a `ROW_NUMBER` becomes a `RANK`, a `DO NOTHING` becomes a `DO UPDATE`, a `COMMIT` becomes a `ROLLBACK`. The change between siblings is usually one clause, and the family doc names it in the policy matrix.

## How to use these docs

1. Read the family doc before you open the starter. The "contract you must honour" section is taken from the prompt and the test, so it tells you the exact aliases, row order and edge cases that will be compared.
2. Attempt `starters/<id>.sql`. Run `node sql-200/verify.cjs --starters --id=<id>` to see it fail, then `node sql-200/verify.cjs --id=<id>` to check the reference.
3. Compare with `solutions/<id>.sql`. Every reference now opens with a `-- Why this works:` block and is laid out one clause per line.
4. Finish with the policy matrix. Once you can predict the other nine scenarios from the one you solved, the family is done.

Two rules hold in every family, and they explain most failures:

- **Only the final statement is graded**, and it is compared row for row, in order, with the exact column aliases. Earlier statements may create tables, mutate data or open transactions; their output is discarded. So an `ORDER BY` is never optional, and a stray `SELECT *` fails on column count before it fails on anything interesting.
- **NULL is not a value, it is the absence of one.** `= NULL` is never true, `NOT IN` against a list containing NULL matches nothing, `SUM` and `AVG` skip NULLs while `COUNT(*)` does not, and `GROUP BY` collects all NULLs into one group while `=` keeps them apart.

## The families

| Doc | IDs | Topic | Level |
| --- | --- | --- | --- |
| [01 Join preservation and matching](01-join-preservation-and-matching.md) | Q001–Q010 | Which rows a join shape keeps: inner, left, anti, self | ★ |
| [02 Multi-table commerce joins](02-multi-table-commerce-joins.md) | Q011–Q020 | Walking a four-table schema without double-counting an aggregate | ★★ |
| [03 GROUP BY HAVING and aggregate policy](03-group-by-having-and-aggregate-policy.md) | Q021–Q030 | `WHERE` before grouping, `HAVING` after, and what each aggregate does with NULL | ★★ |
| [04 Subqueries correlated lookups and existence](04-subqueries-correlated-lookups-and-existence.md) | Q031–Q040 | Scalar, correlated, `IN` and `EXISTS` — and which one the requirement needs | ★★ |
| [05 Ranking and top N per group](05-ranking-and-top-n-per-group.md) | Q041–Q050 | `ROW_NUMBER`, `RANK`, `DENSE_RANK`, and top-N as a filter on the rank | ★★★ |
| [06 Window offsets frames and analytics](06-window-offsets-frames-and-analytics.md) | Q051–Q060 | `LAG`/`LEAD`, and controlling what a window sees with `ROWS`/`RANGE` frames | ★★★ |
| [07 CTE pipelines and recursive traversal](07-cte-pipelines-and-recursive-traversal.md) | Q061–Q070 | `WITH` as a named step, `WITH RECURSIVE` for hierarchies and series | ★★★ |
| [08 Set operations and membership policies](08-set-operations-and-membership-policies.md) | Q071–Q080 | `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT` and their duplicate rules | ★★ |
| [09 NULL semantics and three valued logic](09-null-semantics-and-three-valued-logic.md) | Q081–Q090 | NULL as a third truth value; `COALESCE`, `NULLIF`, NULL-safe comparison | ★★★ |
| [10 SQLite dates times and calendar boundaries](10-sqlite-dates-times-and-calendar-boundaries.md) | Q091–Q100 | The five date functions, modifier strings, and calendar edge cases | ★★★ |
| [11 String normalization parsing and matching](11-string-normalization-parsing-and-matching.md) | Q101–Q110 | `trim`/`lower`/`substr`/`instr`/`replace`, and `LIKE` vs `GLOB` vs `ESCAPE` | ★★ |
| [12 CASE pivot and conditional aggregation](12-case-pivot-and-conditional-aggregation.md) | Q111–Q120 | Both `CASE` forms, and putting one inside an aggregate to turn rows into columns | ★★ |
| [13 SQLite schema constraints and integrity](13-sqlite-schema-constraints-and-integrity.md) | Q121–Q130 | `NOT NULL`, `CHECK`, `UNIQUE`, foreign keys, `WITHOUT ROWID`, `STRICT` | ★★★ |
| [14 UPSERT conflict targets and merge policy](14-upsert-conflict-targets-and-merge-policy.md) | Q131–Q140 | `ON CONFLICT`, the `excluded` pseudo-table, and six merge policies | ★★★ |
| [15 Transactions savepoints and atomic state](15-transactions-savepoints-and-atomic-state.md) | Q141–Q150 | `BEGIN`/`COMMIT`/`ROLLBACK`, nested savepoints, and why `RELEASE` is not a commit | ★★★ |
| [16 UPDATE DELETE and subquery driven mutations](16-update-delete-and-subquery-driven-mutations.md) | Q151–Q160 | Choosing mutation targets with `IN`/`EXISTS`/`NOT EXISTS`; `RETURNING` | ★★★ |
| [17 Gaps islands sequences and streaks](17-gaps-islands-sequences-and-streaks.md) | Q161–Q170 | The difference trick and the running-sum trick for finding runs | ★★★★ |
| [18 Deduplication keep policies and hygiene](18-deduplication-keep-policies-and-hygiene.md) | Q171–Q180 | What counts as a duplicate, which copy survives, and where the dedup happens | ★★★ |
| [19 Parameterized queries with node sqlite bindings](19-parameterized-queries-with-node-sqlite-bindings.md) | Q181–Q190 | `?` and `$name` placeholders, bound patterns, paging, and why interpolation is never the answer | ★★ |
| [20 EXPLAIN QUERY PLAN and index aware queries](20-explain-query-plan-and-index-aware-queries.md) | Q191–Q200 | Reading a plan; scan vs search vs covering index; temp B-trees | ★★★★ |

Level is a rough guide to how much machinery a scenario needs, not to how hard the policy is to see: ★ is one clause, ★★★★ is two or three stacked query blocks or a plan you have to read.

## Suggested order

The families are independent in the sense that each carries its own seed, but they build on each other's ideas. This order introduces one at a time.

1. **Joins and filtering** — 01 Join preservation, 02 Multi-table commerce joins, 08 Set operations, 11 String normalization. How rows are selected, combined and cleaned before anything is computed.
2. **Aggregation and windows** — 03 GROUP BY HAVING, 12 CASE pivot, 04 Subqueries, 05 Ranking, 06 Window offsets, 09 NULL semantics, 10 Dates and calendars, 19 Parameterized queries. Grouping first, then conditional aggregation, then the window functions that compute without collapsing. Take 09 as soon as a NULL surprises you; it explains half the traps in 03 and 04.
3. **Hierarchy and recursion** — 07 CTE pipelines, 17 Gaps islands and streaks, 18 Deduplication, 20 EXPLAIN QUERY PLAN. Multi-step queries: name an intermediate result, then build on it. 17 and 18 both need the window functions from 05 and 06.
4. **Mutation and integrity** — 13 Schema constraints, 14 UPSERT, 16 UPDATE/DELETE mutations, 15 Transactions. Writing rather than reading. Do 13 first — an upsert needs a unique constraint to conflict with — and 15 last, since it is about what survives everything else.

If you would rather go straight down the list, Q001 to Q200 also works; the only place the ID order fights the concept order is that 15 Transactions arrives before 16's mutations and 17's window work.

## Running the verifier

```text
node sql-200/verify.cjs --inventory        # files and manifest only; no database is opened
node sql-200/verify.cjs                    # grade all 200 reference solutions
node sql-200/verify.cjs --id=Q101          # one exercise; --id=101 works too
node sql-200/verify.cjs --starters --id=Q101   # grade your starter instead
node sql-200/verify.cjs --starters         # grade all 200 starters
```

Each run opens its own fresh `:memory:` database, enables `PRAGMA foreign_keys=ON`, seeds the schema and data, runs your SQL, and compares the final statement's rows exactly. Some scenarios then run extra probe statements that check stored state or require a specific constraint error.

Exit codes: `0` if every selected group passed, `1` on any grading failure, `2` on a bad command line or a manifest problem. A SQL syntax error or a missing table is a grading failure (`1`), not a CLI error.

Every run writes a report: `verification-solution.json` or `verification-starter.json`, plus a per-ID file such as `verification-solution-Q101.json` when `--id` is used. Those files are expected output — leave them where they are.

A blank starter executes no statements and returns `[]`, which fails every expected result, because every scenario in this track expects at least one row.

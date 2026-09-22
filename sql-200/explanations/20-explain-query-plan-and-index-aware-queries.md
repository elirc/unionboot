# EXPLAIN QUERY PLAN and index aware queries — sql-200 Q191–Q200

**What you practise:** reading SQLite's query plan, recognising the difference between a scan and a search, and seeing how an index — or the absence of one — changes both.
**Prerequisites:** [13 SQLite schema constraints and integrity](13-sqlite-schema-constraints-and-integrity.md) for `UNIQUE` and the rowid; [02 Multi-table commerce joins](02-multi-table-commerce-joins.md) for joins; `GROUP BY` and `ORDER BY`.
**Exercises:** Q191: rowid-lookup-uses-index, Q192: scan-without-index, Q193: index-creation-changes-plan, Q194: covering-index-avoids-table-lookup, Q195: join-order-inner-outer-loop, Q196: unique-index-enforces-uniqueness, Q197: auto-index-for-unique-constraint, Q198: uncorrelated-in-list-plan, Q199: order-by-uses-index-avoids-sort, Q200: temporary-btree-for-group-by.

## The problem in plain words

Two small tables — three orders and three order lines — and a question no other family asks: *how* does SQLite intend to answer this query?

`EXPLAIN QUERY PLAN` prefixed to a statement does not run it. It returns a small tree describing the plan, one row per step. Each row has `id`, `parent`, `notused` and `detail` columns; this pack's runner keeps only `detail`, because the node ids are version-dependent bookkeeping and the text is the learning target. You can see that in `runtime.cjs`: when the statement's columns are exactly `id,parent,notused,detail`, every row is reduced to `{detail}`.

Two words carry most of the meaning. **SCAN** means SQLite will read every row of the table and test each one. **SEARCH** means it can jump directly to the rows it wants, and the bracketed suffix says how — `(rowid=?)`, `(status=?)` — with the literal from your query shown as `?`. **COVERING INDEX** is the strongest form: every column the query needs is in the index, so the table itself is never read.

An **index** is a sorted structure over one or more columns. Sorted implies two benefits, and this family separates them: an index lets you *find* rows without scanning (Q193), and it lets you *return* them in order without sorting (Q199). Q200 shows the cost of having neither.

A warning the GUIDE states and this doc repeats: the expected `detail` strings are pinned to **SQLite 3.49.1**, the version this pack was authored against. Optimizer text changes between versions. These are educational plan experiments, not cross-version performance tests, and a failing plan assertion on a different Node build is a version difference, not a wrong query.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q191.txt`:

```sql
CREATE TABLE orders2(id INTEGER PRIMARY KEY,customer_id INTEGER NOT NULL,status TEXT NOT NULL);
CREATE TABLE lines2(order_id INTEGER NOT NULL,product_id INTEGER);
INSERT INTO orders2 VALUES(1,10,'paid'),(2,11,'pending'),(3,10,'paid');
INSERT INTO lines2 VALUES(1,100),(1,101),(3,100);
```

- The seed creates **no indexes at all**, apart from the implicit rowid of `orders2`. `lines2` has no primary key, so it has no unique structure either. Every index in this family is created by the submission.
- `orders2.id` is `INTEGER PRIMARY KEY`, so it is the rowid: that is why Q191's plan says `INTEGER PRIMARY KEY (rowid=?)` rather than naming an index.
- The graded column for the eight `EXPLAIN` exercises is `detail`, and the rows are compared exactly and in order:
  - Q191: `SEARCH orders2 USING INTEGER PRIMARY KEY (rowid=?)`
  - Q192: `SCAN orders2`
  - Q193: `SEARCH orders2 USING INDEX orders2_status (status=?)`
  - Q194: `SEARCH orders2 USING COVERING INDEX orders2_cover (status=?)`
  - Q195: `SEARCH o USING COVERING INDEX orders2_status (status=?)` then `SEARCH l USING INDEX lines2_order (order_id=?)`
  - Q197: `SEARCH t2 USING COVERING INDEX sqlite_autoindex_t2_1 (x=?)`
  - Q198: `SCAN orders2`, `LIST SUBQUERY 1`, `SCAN orders2`, `CREATE BLOOM FILTER`
  - Q199: `SEARCH orders2 USING COVERING INDEX orders2_status_cust (status=?)`
  - Q200: `SCAN lines2` then `USE TEMP B-TREE FOR GROUP BY`
- **The index names are part of the expected output.** `orders2_status`, `orders2_cover`, `lines2_order` and `orders2_status_cust` are not free choices; the plan text prints whatever you called the index.
- Q195 uses the table aliases `o` and `l`, and the plan prints the aliases, not the table names.
- Q199's expectation is a single row. The assertion is as much about the row that is *absent* — there is no `USE TEMP B-TREE FOR ORDER BY` step — as about the one that is present.
- Q196 is the odd one out: it runs the query instead of explaining it. It expects the four `lines2` rows ordered by `order_id, product_id`, and a probe then requires a repeat of `(1,100)` to fail with `UNIQUE`.

## Approach

1. **Create the index in an earlier statement, then explain.** Only the final statement's rows are graded, so `CREATE INDEX …; EXPLAIN QUERY PLAN SELECT …;` is the standard two-step shape here.
2. **Name the index exactly as the expected plan text does.** The name is data in the assertion.
3. **Put the equality column first in a composite index.** `(status,customer_id)` can be searched by `status`; `(customer_id,status)` cannot answer a `status=?` lookup with a seek.
4. **Select only indexed columns when you want a covering plan.** `SELECT customer_id … WHERE status=?` over `(status,customer_id)` is covering; `SELECT *` over the same index is not, because the other columns still have to be fetched from the table.
5. **Match the index's trailing column to the `ORDER BY`** when you want to avoid a sort. The index is already in that order, so SQLite can walk it.
6. **Pin a join's shape with `CROSS JOIN` and `INDEXED BY` when the plan itself is the answer.** `CROSS JOIN` tells the planner not to reorder the tables, and `INDEXED BY` makes the query fail rather than silently choose a different index.
7. **Read the plan's rows as a tree in execution order:** the outer loop first, then what it drives.
8. **Expect a `USE TEMP B-TREE` step whenever a `GROUP BY` or `ORDER BY` has no index to lean on.** It is not an error; it is the cost of sorting at query time.

## Worked example — Q191 rowid-lookup-uses-index

The task, quoted from the prompt: "Confirm point lookup by rowid primary key uses Search orders2 USING INTEGER PRIMARY KEY (rowid=?) rather than a SCAN."

**Step 1 — the statement being explained.**

```sql
SELECT * FROM orders2 WHERE id = 1;
```

`orders2.id` is declared `INTEGER PRIMARY KEY`, so it is not a separate column at all: it is the table's rowid, and the table is physically stored as a B-tree keyed by it.

**Step 2 — prefix `EXPLAIN QUERY PLAN`.** The query is compiled but not executed. SQLite reports the access path it would use.

**Step 3 — the raw plan rows.** `EXPLAIN QUERY PLAN` returns four columns:

| id | parent | notused | detail |
| --- | --- | --- | --- |
| 2 | 0 | 0 | `SEARCH orders2 USING INTEGER PRIMARY KEY (rowid=?)` |

**Step 4 — the runner reduces each row to its `detail`.** From `runtime.cjs`: if the statement's column names are `id,parent,notused,detail`, each row becomes `{detail}`. So the graded value is:

```json
[{"detail":"SEARCH orders2 USING INTEGER PRIMARY KEY (rowid=?)"}]
```

which is what `tests/Q191.cjs` asserts.

**How to read that line.** `SEARCH` — a direct lookup, not a full read. `orders2` — the table (or its alias). `USING INTEGER PRIMARY KEY` — the access path is the table's own rowid B-tree, so no secondary index is involved. `(rowid=?)` — the constraint being used; the literal `1` is printed as `?` because the plan is about the shape of the query, not its values.

The reference solution, as it now reads in `solutions/Q191.sql`:

```sql
-- Why this works:
-- EXPLAIN QUERY PLAN does not run the query; it returns the plan SQLite
-- chose, one row per step. The runner keeps only the detail column, because
-- the node and parent ids are version-dependent bookkeeping.
-- id is declared INTEGER PRIMARY KEY, which makes it an alias for the
-- rowid, so an equality test on it is a direct B-tree lookup.
-- SEARCH means "go straight to the matching rows"; SCAN, the word in Q192,
-- means "read the whole table". The (rowid=?) suffix shows the constraint
-- the plan is using, with the literal rendered as ?.
-- The detail text is pinned to SQLite 3.49.1 and may differ elsewhere.
EXPLAIN QUERY PLAN
SELECT * FROM orders2 WHERE id = 1;
```

**The Q192 → Q193 → Q194 progression, which is the family in miniature.**

| Exercise | Statement | Plan detail | Why |
| --- | --- | --- | --- |
| Q192 | `SELECT * … WHERE status='paid'` | `SCAN orders2` | no index on `status`; every row is read and tested |
| Q193 | the same query, after `CREATE INDEX orders2_status ON orders2(status)` | `SEARCH orders2 USING INDEX orders2_status (status=?)` | the index locates the rows; the table is still read for the other columns |
| Q194 | `SELECT customer_id … WHERE status='paid'`, after an index on `(status,customer_id)` | `SEARCH orders2 USING COVERING INDEX orders2_cover (status=?)` | the index holds both columns the query needs, so the table is never touched |

One statement changes between Q192 and Q193; one column list and one index definition change between Q193 and Q194.

## Policy matrix — what changes between the variants

| ID | Variant | What it demonstrates | What changes in the SQL |
| --- | --- | --- | --- |
| Q191 | rowid-lookup-uses-index | a rowid lookup is a search with no named index | `EXPLAIN QUERY PLAN SELECT * … WHERE id=1` |
| Q192 | scan-without-index | an unindexed predicate reads the whole table here | the filter moves to `status` |
| Q193 | index-creation-changes-plan | an index turns the scan into a search | a `CREATE INDEX` runs first |
| Q194 | covering-index-avoids-table-lookup | a covering index removes the table lookup | composite index, and the `SELECT` list shrinks to indexed columns |
| Q195 | join-order-inner-outer-loop | a join is nested loops, outer step printed first | two indexes, `CROSS JOIN` and two `INDEXED BY` hints |
| Q196 | unique-index-enforces-uniqueness | an index can be a constraint | `CREATE UNIQUE INDEX`, an `INSERT`, and a real `SELECT` |
| Q197 | auto-index-for-unique-constraint | `UNIQUE` creates a named, persistent index | `CREATE TABLE t2(x TEXT UNIQUE)` then explain a lookup on `x` |
| Q198 | uncorrelated-in-list-plan | an uncorrelated `IN` becomes a list subquery | an `IN (SELECT …)` with no indexes to help it |
| Q199 | order-by-uses-index-avoids-sort | index order can replace a sort | index on `(status,customer_id)`, `ORDER BY customer_id` |
| Q200 | temporary-btree-for-group-by | no index means a temporary sort structure | `GROUP BY product_id` on unindexed `lines2` |

## Pitfalls the tests are designed to catch

- **Naming the index differently.** `CREATE INDEX idx_status …` produces `SEARCH orders2 USING INDEX idx_status (status=?)`, which is not the asserted string. The expected text fixes the name.
- **Putting the `EXPLAIN` before the `CREATE INDEX`.** Only the last statement is graded, so the order is `CREATE INDEX; EXPLAIN …;`. Reversed, the graded statement is the `CREATE`, which returns no rows.
- **Using `SELECT *` where a covering plan is expected.** Q194 and Q199 both need the `SELECT` list to stay inside the index; `SELECT *` drops `COVERING` from the plan text.
- **Getting the composite index column order backwards.** `ON orders2(customer_id,status)` cannot serve `WHERE status=?` as a seek, so Q194 and Q199 fall back to a scan.
- **Omitting `CROSS JOIN` in Q195.** A plain join lets the planner choose which table drives the loop; with this data either choice is reasonable, and the two plan rows could come back in the other order. `CROSS JOIN` fixes the order so the assertion is stable.
- **Dropping the `INDEXED BY` hints in Q195.** Without them SQLite may pick a different index — or none — and the plan text stops matching. The prompt calls these hints a teaching device, not tuning advice.
- **Expecting the table names in Q195's plan.** The query aliases them `o` and `l`, and the plan prints the aliases.
- **Reading `sqlite_autoindex_t2_1` as a temporary structure.** It is the persistent index SQLite creates to enforce `UNIQUE`, and it lives in the schema. It is not the same thing as the throwaway `AUTOMATIC COVERING INDEX` the planner sometimes builds for a single query.
- **Creating an explicit index in Q197.** The exercise is about the index you get for free from the `UNIQUE` constraint; adding your own changes the name in the plan.
- **Explaining Q196.** It is the one exercise in the family that runs its query: the expected rows are data, and a probe checks that the duplicate insert fails with `UNIQUE`.
- **Creating Q196's unique index over data that already violates it.** The seed's three `lines2` rows are distinct as pairs, which is why the `CREATE UNIQUE INDEX` succeeds; on conflicting data it would fail immediately.
- **Assuming a plan is stable across versions.** Q198's four rows, including `CREATE BLOOM FILTER`, are what SQLite 3.49.1 produces. The GUIDE says these comparisons target that version; a different Node build may plan the same query differently.
- **Reading "SCAN" as a mistake.** For a three-row table a scan is the cheapest plan available. These exercises show which plan is *chosen* under the stated conditions, not a rule that an unindexed predicate always forces a scan — Q192's prompt says so in as many words.

## Try it yourself

1. Add `CREATE INDEX lines2_product ON lines2(product_id);` before Q200's `EXPLAIN` and predict what happens to the `USE TEMP B-TREE FOR GROUP BY` row.
2. Change Q199's `ORDER BY customer_id` to `ORDER BY customer_id DESC` and say, before running it, whether a temporary B-tree appears. What property of an index makes your answer plausible?
3. Q194's index is `(status,customer_id)`. Write the `SELECT` that would make the same index non-covering without changing the `WHERE` clause.
4. In words: Q191 and Q193 both say `SEARCH`, and only one names an index. Explain the difference, and say what that implies about how an `INTEGER PRIMARY KEY` table is stored.

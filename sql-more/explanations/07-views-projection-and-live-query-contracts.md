# Views projection and live query contracts — sql-more Q261–Q270

**What you practise:** defining a view as a named, stored query; composing views; and knowing precisely what a view is not — not a copy of the data, not writable, and not a security boundary.
**Prerequisites:** `SELECT` with `WHERE` and `GROUP BY`; [05 Partial expression and composite index contracts](05-partial-expression-and-composite-index-contracts.md) for reading `sqlite_schema`.
**Exercises:** Q261: filtered-view, Q262: aggregate-view, Q263: live-view-after-base-update, Q264: view-explicit-column-names, Q265: nested-view-composition, Q266: sqlite-view-readonly, Q267: drop-view-preserve-base, Q268: replace-view-via-drop-create, Q269: temporary-view-schema, Q270: projection-not-security-boundary.

## The problem in plain words

A **view** is a `SELECT` statement stored in the schema under a name. `CREATE VIEW paid_orders AS SELECT id,customer,amount FROM orders WHERE status='paid'` adds no rows to the database; it adds a definition. Every time something reads `paid_orders`, SQLite substitutes that query and runs it against the current contents of `orders`.

Two consequences shape the whole family:

- **A view is live.** Change the base table and the next read of the view sees the change, with nothing to refresh (Q263). This is the opposite of a *materialised* view, which stores its results; SQLite has no materialised views.
- **A view is read-only in SQLite** unless you attach an `INSTEAD OF` trigger. `INSERT INTO all_orders ...` fails with `cannot modify all_orders because it is a view` (Q266).

The rest of the family is about what you can and cannot do to a view definition. You may name its columns explicitly (Q264). You may build a view on top of another view (Q265). You may not redefine one in place: SQLite has no `CREATE OR REPLACE VIEW`, so changing a definition means `DROP VIEW` then `CREATE VIEW` (Q268). A `TEMP VIEW` lives in a separate schema, visible through `sqlite_temp_schema` rather than `sqlite_schema` (Q269).

And the last scenario says out loud what the GUIDE also says — "Views are projections, not authorization boundaries". A view that omits `customer` hides nothing: any caller who can read the view can also read `orders` directly. The projection is an interface, not a permission.

## The contract you must honour

Taken from `prompts/Q261.txt`–`Q270.txt` and `tests/Q261.cjs`–`Q270.cjs`. All ten share one seed:

```sql
CREATE TABLE orders(id INTEGER PRIMARY KEY, customer TEXT, status TEXT, amount INTEGER);
INSERT INTO orders VALUES(1,'Ada','paid',10),(2,'Ada','pending',20),
                         (3,'Bo','paid',30),(4,'Cy','cancelled',40);
```

- Three statuses and one repeated customer (Ada appears twice, once paid and once pending). That is enough to separate "paid only" from "all statuses" in the aggregates.
- Every answer is multi-statement: one or more `CREATE VIEW` statements, sometimes a `DROP` or an `UPDATE`, then the graded `SELECT`. Only the final statement's rows are compared.
- View names are fixed by the prompts and by Q266's probe: `paid_orders` (Q261, Q263, Q265, Q267), `revenue` (Q262), `totals` (Q264), `high_paid` (Q265), `all_orders` (Q266), `active_orders` (Q268), `local_paid` (Q269), `public_orders` (Q270).
- Aliases: `id, customer, amount` (Q261); `customer, total` (Q262); `id, amount` (Q263, Q265); `person, total` (Q264); `count` (Q266); `orders, views` (Q267); `id` (Q268); `name, type, rows_count` (Q269); `id, status` (Q270).
- Q266 carries a **post-result integrity assertion**: `INSERT INTO all_orders VALUES(5,'Dee','paid',1)` must fail with a message matching `cannot modify.*view`. So the object called `all_orders` has to be a genuine view and not a copied table.
- Q262's expected rows show `Ada` at `10`, not `30` — the view filters to paid rows before grouping. Q264's expected `Ada` is `30`, because that view aggregates every status.
- Single-row answers (Q266, Q267, Q269) have no `ORDER BY`; everything else orders explicitly.

### View behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session:

- `INSERT INTO <view> ...` and `UPDATE <view> SET ...` both fail with `cannot modify <name> because it is a view`, which matches Q266's `cannot modify.*view` pattern.
- `CREATE OR REPLACE VIEW ...` is a **syntax error** in SQLite: `near "OR": syntax error`. Q268's drop-then-create is not a stylistic choice.
- `sqlite_schema` lists a view with `type='view'`. A `TEMP VIEW` does **not** appear there; it appears in `sqlite_temp_schema`, whose `sql` column shows the definition with the `TEMP` keyword already dropped.
- `count` is not a reserved word in SQLite, so `COUNT(*) AS count` parses.
- Dropping a view removes only the definition; the base table keeps all four rows.

## Approach

1. **Put the filter in the view when it is part of the view's meaning** (Q261, Q262). `paid_orders` is defined as "the paid ones"; callers should not have to remember the `status='paid'` predicate.
2. **Name the columns you expose.** `SELECT id,customer,amount` rather than `SELECT *` fixes the view's shape even if the table later grows a column.
3. **Name aggregate columns.** `SUM(amount) AS total` inside the view, or the explicit column list form `CREATE VIEW totals(person,total) AS ...` (Q264). Without a name the column would be called `SUM(amount)` and callers would have to quote it.
4. **Read the view with `SELECT *` and order outside it.** A view is a query, and its own `ORDER BY` would be an internal detail; putting `ORDER BY` in the outer statement makes the graded order explicit and lets different callers order differently.
5. **Compose rather than duplicate** (Q265). `high_paid` selects from `paid_orders`, so the definition of "paid" lives in exactly one place, and SQLite flattens the two definitions into a single query when it runs.
6. **Change a definition with `DROP VIEW` then `CREATE VIEW`** (Q268). Nothing is lost, because no rows were ever stored.
7. **Prove existence by counting catalogue rows** (Q267, Q269) rather than by provoking an error: `SELECT COUNT(*) FROM sqlite_schema WHERE name='paid_orders'`.
8. **Remember which catalogue a temporary object lives in** (Q269). `sqlite_temp_schema` for `TEMP`; `sqlite_schema` for everything else.

## Worked example — Q261 filtered-view

The task, quoted from `prompts/Q261.txt`: "Create paid_orders view exposing id,customer,amount for paid rows; select ordered by id."

**Step 1 — the seed rows.**

| id | customer | status | amount |
| --- | --- | --- | --- |
| 1 | Ada | paid | 10 |
| 2 | Ada | pending | 20 |
| 3 | Bo | paid | 30 |
| 4 | Cy | cancelled | 40 |

**Step 2 — `CREATE VIEW paid_orders AS SELECT id,customer,amount FROM orders WHERE status='paid'`.** Nothing is computed and nothing is stored. SQLite writes one row into `sqlite_schema` with `type='view'` and the text of the query.

**Step 3 — `SELECT * FROM paid_orders`.** Now the definition is substituted and run. Two things happen at once:

| id | customer | status | amount | kept by `status='paid'`? | columns exposed |
| --- | --- | --- | --- | --- | --- |
| 1 | Ada | paid | 10 | yes | id, customer, amount |
| 2 | Ada | pending | 20 | no | — |
| 3 | Bo | paid | 30 | yes | id, customer, amount |
| 4 | Cy | cancelled | 40 | no | — |

The `*` in the outer query expands to the *view's* three columns, not the table's four. `status` is not reachable through `paid_orders` at all — which is the projection half of the view's job.

**Step 4 — `ORDER BY id`.** The view definition has no ordering; the caller supplies it.

| id | customer | amount |
| --- | --- | --- |
| 1 | Ada | 10 |
| 3 | Bo | 30 |

**The asserted result**, from `tests/Q261.cjs`:

```sql
-- [{"id":1,"customer":"Ada","amount":10},{"id":3,"customer":"Bo","amount":30}]
```

The reference solution as it now reads in `solutions/Q261.sql`:

```sql
-- Why this works:
-- A view is a named query stored in the schema, not a copy of the rows, so
-- creating it computes nothing.
-- The definition carries both halves of the contract: the WHERE selects the
-- paid rows and the select list fixes the three exposed columns.
-- SELECT * in the outer query therefore expands to the view's columns, not
-- to the four columns of orders; status is not reachable through the view.
-- ORDER BY belongs in the caller, so different readers may order the same
-- view differently.
CREATE VIEW paid_orders AS
SELECT id,
       customer,
       amount
FROM orders
WHERE status = 'paid';
SELECT *
FROM paid_orders
ORDER BY id;
```

**Contrast with Q263**, which creates the same kind of view and then updates order 2 to `paid` before reading it. The view returns three rows. Nothing refreshed it: the definition is re-run on every read, so the view could not have been stale.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q261 | filtered-view | "exposing id,customer,amount for paid rows" | one `CREATE VIEW` with a `WHERE`, then `SELECT * ... ORDER BY id` |
| Q262 | aggregate-view | "paid amount per customer" | the view body gains `SUM(amount) AS total` and `GROUP BY customer` |
| Q263 | live-view-after-base-update | "must reflect base mutation without refresh" | an `UPDATE orders` between the create and the read |
| Q264 | view-explicit-column-names | "totals(person,total) … aggregating all statuses" | column list after the view name; no `WHERE` in the body |
| Q265 | nested-view-composition | "high_paid filtering amount>=20 from it" | a second view whose `FROM` is the first view |
| Q266 | sqlite-view-readonly | "direct INSERT into view fails" | a pass-through view plus `COUNT(*) AS count`; the probe supplies the failing insert |
| Q267 | drop-view-preserve-base | "base row count and view-existence count" | `DROP VIEW`, then a count with a scalar subquery over `sqlite_schema` |
| Q268 | replace-view-via-drop-create | "SQLite lacks CREATE OR REPLACE VIEW" | create, `DROP VIEW`, create again with a wider `WHERE ... IN` |
| Q269 | temporary-view-schema | "TEMP VIEW … from sqlite_temp_schema" | `CREATE TEMP VIEW`, read back from `sqlite_temp_schema` |
| Q270 | projection-not-security-boundary | "exposing only id,status" | a view with a narrow select list and no filter at all |

## Pitfalls the tests are designed to catch

- **Creating a table instead of a view.** `CREATE TABLE paid_orders AS SELECT ...` produces the same rows for Q261 and then fails Q263 (it would not see the update) and Q266 (the insert would succeed instead of raising).
- **Putting the filter in the outer query.** `CREATE VIEW paid_orders AS SELECT * FROM orders` plus `SELECT id,customer,amount FROM paid_orders WHERE status='paid'` returns the right rows but misses the point: the view no longer means "the paid ones", and Q270's narrow projection would not exist.
- **Filtering in the wrong place in Q262 versus Q264.** Q262's `Ada` is `10` because the view filters to paid rows before grouping; Q264's `Ada` is `30` because it sums every status. The two differ by one `WHERE` clause.
- **Leaving the aggregate unnamed.** `SELECT customer, SUM(amount) FROM ...` gives the view a column called `SUM(amount)`. Q262 asserts the key `total`, so either an `AS total` inside the view or Q264's explicit column-list form is required.
- **Expecting a view to be writable.** Q266's probe requires the error. SQLite allows writes to a view only through an `INSTEAD OF` trigger, which this scenario deliberately does not create.
- **Reaching for `CREATE OR REPLACE VIEW` in Q268.** It is a syntax error in SQLite — the statement fails at `OR`. The drop-then-create sequence is the supported way, and it is safe because a view holds no data.
- **Looking for a `TEMP VIEW` in `sqlite_schema`.** It is not there. Q269 expects one row from `sqlite_temp_schema`, and the `type` column reads `view`.
- **Assuming Q270's view hides anything.** It does not; any connection that can query `public_orders` can query `orders`. The prompt says so, and the GUIDE repeats it. Real column-level restriction needs a mechanism outside the database.
- **Adding `ORDER BY` inside a view definition.** SQLite permits it, but it is not a contract: an outer query is free to reorder, and any join or aggregation over the view discards it. Every exercise here orders in the outer statement.
- **Dropping the base table to "clean up" in Q267.** The expected `orders` count is `4`. `DROP VIEW` removes only the definition; the rows are untouched.
- **Expecting `SELECT * FROM high_paid` to see `status` in Q265.** The inner view already projected it away, so the outer view cannot filter on it — which is the reason `high_paid` filters on `amount`.

## Try it yourself

1. Add an `INSTEAD OF INSERT` trigger on `all_orders` that writes to `orders`. Does Q266's probe still fail, and what does that tell you about where the read-only rule lives?
2. Redefine Q262's `revenue` to include customers with no paid orders, showing `0`. Which join does the view body need, and does anything about the outer query change?
3. Run `EXPLAIN QUERY PLAN SELECT * FROM high_paid` in Q265. Does the plan mention either view by name?
4. In words: Q263 shows that a view is never stale. Describe one situation where that is the wrong trade-off, and what you would build instead in SQLite.

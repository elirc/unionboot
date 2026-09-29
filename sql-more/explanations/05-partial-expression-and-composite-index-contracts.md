# Partial expression and composite index contracts — sql-more Q241–Q250

**What you practise:** writing indexes that cover only some rows (`WHERE`), index an expression rather than a column, or order two columns differently — and then proving what you built by reading SQLite's index metadata and query plans.
**Prerequisites:** [04 Generated columns and derived schema invariants](04-generated-columns-and-derived-schema-invariants.md); `CREATE INDEX`; the idea that a `UNIQUE` index is a constraint, not just an accelerator.
**Exercises:** Q241: partial-active-unique, Q242: tenant-scoped-active-unique, Q243: partial-index-metadata, Q244: expression-index-metadata, Q245: composite-key-order-metadata, Q246: expression-search-plan, Q247: partial-index-query-plan, Q248: composite-left-prefix-range, Q249: partial-unique-transition-failure, Q250: drop-index-preserve-data.

## The problem in plain words

An index is usually introduced as a speed trick. Half of this family treats it as something stricter: a `UNIQUE` index is the mechanism SQLite uses to enforce uniqueness, and a **partial index** — one written `CREATE UNIQUE INDEX ... ON t(...) WHERE <condition>` — enforces that uniqueness *only over the rows the condition selects*. That expresses a rule ordinary column constraints cannot: "two active users may not share an email address, but a soft-deleted row may keep its old address".

Two other index shapes appear:

- An **expression index**, `ON users(lower(email))`, indexes a computed value. It enforces or accelerates a rule about the normalised form rather than the stored text. SQLite will use it only when the query's expression matches the indexed one.
- A **composite index**, `ON users(tenant, email)`, indexes a pair. Column order matters: the index can answer "tenant = 10 and email ≥ 'B'" by seeking on the first column and scanning a range of the second, but it cannot seek on `email` alone.

The other half of the family is introspection. SQLite exposes the schema through PRAGMAs, and `pragma_index_list` / `pragma_index_xinfo` are their table-valued forms — usable directly in a `FROM` clause. `EXPLAIN QUERY PLAN` (EQP) reports, in one line of text per loop, which index the planner chose and which constraints it used.

## The contract you must honour

Taken from `prompts/Q241.txt`–`Q250.txt` and `tests/Q241.cjs`–`Q250.cjs`. All ten share one seed:

```sql
CREATE TABLE users(id INTEGER PRIMARY KEY, email TEXT, active INTEGER, tenant INTEGER);
INSERT INTO users VALUES(1,'Ada@x',1,10),(2,'ada@x',0,10),(3,'Bo@x',1,20);
```

- Rows 1 and 2 hold the **same email in different case**, one active and one not. That pair is what makes a partial unique index on `lower(email)` interesting: without the `WHERE active=1` it would reject the seed itself.
- There is no boolean type: `active` is the integer `1` or `0`. The GUIDE says so — "No true boolean storage type; flags are integers/NULL".
- Every answer is multi-statement: a `CREATE INDEX`, sometimes an `INSERT` or `DROP`, then the graded statement. Only the final statement's rows count.
- Aliases: `id, email` (Q241); `id` (Q242, Q249); `name, is_unique, partial` (Q243); `seqno, cid, name` (Q244); `name, descending` (Q245); `detail` (Q246, Q247, Q248); `users, indexes` (Q250).
- Four exercises carry **post-result integrity assertions**. They name your index's effects, not its name, but they do name your table:
  - Q241: `INSERT INTO users VALUES(4,'ADA@X',1,30)` must fail matching `UNIQUE`; then `INSERT INTO users VALUES(4,'ADA@X',0,30);SELECT COUNT(*) AS n FROM users` must return `{"n":4}`.
  - Q242: `INSERT INTO users VALUES(5,'ada@x',1,10)` must fail matching `UNIQUE`.
  - Q249: `UPDATE users SET active=1 WHERE id=2` must fail matching `UNIQUE`.
- **EQP rows are special-cased by the runtime.** `runtime.cjs` checks whether the final statement's columns are exactly `id,parent,notused,detail` and, if so, keeps only `detail`. That is why Q246–Q248 expect a single `detail` key: the numeric node ids and cost estimates, which vary, are dropped. The GUIDE states the matching constraint: "EQP text targets SQLite 3.49.1; optimizer details can change on another Node/SQLite version."
- Index names are asserted through the expected rows, so they are fixed: `active_only` (Q243), `normalized` (Q244, Q246, Q250), `tenant_email` (Q245, Q248), `active_tenant` (Q247).

### Index and metadata behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session:

- `pragma_index_list('users')` returns `seq, name, unique, origin, partial`. `unique` and `partial` are `0`/`1`; `origin` is `'c'` for an index created by `CREATE INDEX`. `unique` is a reserved word, so it has to be written `"unique"` in the select list.
- `pragma_index_xinfo('<index>')` returns `seqno, cid, name, desc, coll, key` — one row per index entry, including the trailing rowid entry with `key = 0`. `WHERE key=1` keeps only the declared key columns.
- For an expression index, the key entry has `cid = -2` and `name = NULL`: there is no table column to name. For the appended rowid entry, `cid = -1`.
- For `ON users(tenant ASC, email DESC)` the two key rows are `{tenant, desc 0}` and `{email, desc 1}`, in `seqno` order.
- `EXPLAIN QUERY PLAN SELECT id FROM users WHERE lower(email)='ada@x'`, with `normalized` present, reports `SEARCH users USING COVERING INDEX normalized (<expr>=?)`. "COVERING" means every column the query needs is in the index, so the table itself is never read; `<expr>` is how SQLite renders an indexed expression.
- `... INDEXED BY tenant_email WHERE tenant=10 AND email>='B'` reports `SEARCH users USING COVERING INDEX tenant_email (tenant=? AND email>?)`. Note the `>=` is rendered as `>`: the plan records that there is a lower bound, not which comparison operator produced it.
- `INDEXED BY <name>` is a SQLite hint that *requires* the named index; the statement fails if the planner cannot use it. It is not portable SQL.
- `sqlite_schema` is the catalogue table (older name `sqlite_master`); dropping an index removes its row and leaves the table's rows untouched.

## Approach

1. **Decide whether the index is a rule or an optimisation.** A rule needs `UNIQUE`; an optimisation does not. Q241, Q242 and Q249 are rules, enforced entirely by the index.
2. **Scope a rule with `WHERE`.** `WHERE active=1` makes the index — and therefore the constraint — apply only to active rows. Inactive rows are simply not in the index, so they cannot collide with anything.
3. **Normalise inside the index when the rule is about a normalised value.** `ON users(lower(email))` means `Ada@x` and `ADA@X` occupy the same slot.
4. **Widen the scope of a rule by adding a leading column.** `ON users(tenant, lower(email))` turns "unique per system" into "unique per tenant", because the pair is what must be distinct (Q242).
5. **Read `pragma_index_list` for facts about the index as a whole** — is it unique, is it partial (Q243) — and `pragma_index_xinfo` for facts about its columns — position, direction, expression-ness (Q244, Q245).
6. **Filter `pragma_index_xinfo` with `WHERE key=1` and order by `seqno`.** Without the filter the appended rowid row appears; without the ordering the key order is not promised.
7. **Write the query so that the indexed expression appears verbatim** when you want the expression index used (Q246). `WHERE lower(email)='ada@x'` matches; `WHERE email='ada@x'` does not.
8. **Force a specific index with `INDEXED BY`** when the exercise is about proving a particular plan (Q247, Q248) rather than about letting the planner choose.
9. **Count catalogue rows rather than trusting an error** to prove a drop (Q250): `SELECT COUNT(*) FROM sqlite_schema WHERE type='index' AND name='normalized'`.

## Worked example — Q241 partial-active-unique

The task, quoted from `prompts/Q241.txt`: "Create UNIQUE index on lower(email) only where active=1, return active emails. Grader rejects duplicate active spelling but permits inactive duplicate."

**Step 1 — the seed rows.**

| id | email | active | tenant |
| --- | --- | --- | --- |
| 1 | Ada@x | 1 | 10 |
| 2 | ada@x | 0 | 10 |
| 3 | Bo@x | 1 | 20 |

**Step 2 — `CREATE UNIQUE INDEX active_email ON users(lower(email)) WHERE active=1`.** SQLite builds the index by walking the table, skipping rows that fail the `WHERE`, and computing `lower(email)` for the rest.

| id | in the index? | key |
| --- | --- | --- |
| 1 | yes (`active=1`) | `ada@x` |
| 2 | no (`active=0`) | — |
| 3 | yes | `bo@x` |

Two entries, both distinct, so the index is created successfully. Had the `WHERE` been omitted, rows 1 and 2 would both produce the key `ada@x` and `CREATE UNIQUE INDEX` would fail on the existing data.

**Step 3 — `SELECT id,email FROM users WHERE active=1 ORDER BY id`.** The graded statement reads the table, not the index, and returns the stored spelling — `Ada@x`, not the normalised `ada@x`.

| id | email |
| --- | --- |
| 1 | Ada@x |
| 3 | Bo@x |

**Step 4 — the integrity probes**, run by `runtime.cjs` after the rows match.

| probe | key it would need | outcome |
| --- | --- | --- |
| `INSERT ... (4,'ADA@X',1,30)` | `ada@x`, active, so indexed | collides with row 1 — `UNIQUE constraint failed` |
| `INSERT ... (4,'ADA@X',0,30)` | inactive, so not indexed | accepted; the following count returns 4 |

The tenant differs in both probes, which shows this index does not care about tenant at all — that is Q242's job.

**The asserted result**, from `tests/Q241.cjs`:

```sql
-- [{"id":1,"email":"Ada@x"},{"id":3,"email":"Bo@x"}]
```

The reference solution as it now reads in `solutions/Q241.sql`:

```sql
-- Why this works:
-- A UNIQUE index is how SQLite enforces uniqueness, and a WHERE clause on
-- the index makes that rule apply to only the rows it selects.
-- Here only active rows are indexed, so id 2 keeps the same address as id 1
-- without colliding, which is exactly the soft-delete policy wanted.
-- Indexing lower(email) rather than email makes the rule case-insensitive,
-- so the probe inserting ADA@X as active collides with id 1.
-- The graded SELECT reads the table, so it returns the stored spelling
-- Ada@x rather than the normalized index key.
CREATE UNIQUE INDEX active_email ON users(lower(email)) WHERE active = 1;
SELECT id,
       email
FROM users
WHERE active = 1
ORDER BY id;
```

**Contrast with Q249**, which builds the identical index and then lets the probe try `UPDATE users SET active=1 WHERE id=2`. Row 2 is not in the index while it is inactive; activating it *adds* it, the key `ada@x` is already taken by row 1, and the update is rejected. A partial index constrains transitions into its scope as well as inserts.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q241 | partial-active-unique | "unique on lower(email) only where active=1" | `CREATE UNIQUE INDEX ... ON users(lower(email)) WHERE active=1` |
| Q242 | tenant-scoped-active-unique | "same email in different tenant is allowed" | the key gains a leading column: `(tenant, lower(email))`; an extra `INSERT` adds id 4 |
| Q243 | partial-index-metadata | "inspect unique and partial flags" | non-unique index, then `pragma_index_list('users')` with `"unique"` quoted |
| Q244 | expression-index-metadata | "expression cid=-2 and name=NULL" | `pragma_index_xinfo('normalized') WHERE key=1` |
| Q245 | composite-key-order-metadata | "tenant ASC, email DESC" | the same pragma, selecting `desc AS descending` |
| Q246 | expression-search-plan | "explain exact-expression equality lookup" | `EXPLAIN QUERY PLAN` over `WHERE lower(email)='ada@x'` |
| Q247 | partial-index-query-plan | "require that index using INDEXED BY" | partial index on `tenant`, plan forced with `INDEXED BY active_tenant` |
| Q248 | composite-left-prefix-range | "tenant10 and email>=B" | composite index, plan shows `(tenant=? AND email>?)` |
| Q249 | partial-unique-transition-failure | "activating id2 must fail" | same index as Q241; the graded select returns inactive ids |
| Q250 | drop-index-preserve-data | "report remaining users and count of named index" | `DROP INDEX`, then a count over `users` with a scalar subquery over `sqlite_schema` |

## Pitfalls the tests are designed to catch

- **Omitting the `WHERE` from the unique index.** `CREATE UNIQUE INDEX ON users(lower(email))` fails immediately on the seed, because rows 1 and 2 already collide. The error arrives at `CREATE`, not at the probe.
- **Indexing `email` instead of `lower(email)`.** The index would be created, and Q241's first probe inserting `ADA@X` would succeed — so the exercise fails on the probe rather than on the rows.
- **Expecting the graded select to return normalised text.** The index stores `ada@x`; the table still stores `Ada@x`, and that is what a `SELECT email` returns.
- **Forgetting the leading `tenant` in Q242.** Without it the extra `INSERT INTO users VALUES(4,'ADA@X',1,20)` collides with row 1 and the answer never reaches the graded select.
- **Writing `unique` unquoted in Q243.** `UNIQUE` is a reserved word; `SELECT name,unique FROM ...` is a syntax error. `"unique" AS is_unique` both escapes it and supplies the required alias.
- **Using `pragma_index_info` in Q244 or Q245.** The shorter pragma has no `desc` column and does not include the rowid entry, so the `key=1` filter and the `descending` column both come from `index_xinfo`.
- **Dropping `WHERE key=1`.** Every index gets a trailing entry for the rowid with `cid=-1` and `name=NULL`; Q244 expects exactly one row and Q245 exactly two.
- **Writing the query predicate differently from the indexed expression in Q246.** SQLite matches expression indexes textually after normalisation; `WHERE lower(email) = 'ada@x'` uses the index, `WHERE email = 'ada@x' COLLATE NOCASE` does not, and the plan then reads `SCAN users`.
- **Selecting more columns than the index holds in Q246–Q248.** The expected detail says `COVERING INDEX`. Adding `email` to the select list of Q247 would make the plan read the table too and the word `COVERING` would disappear.
- **Expecting `>=` in Q248's plan text.** SQLite renders the bound as `email>?`. The plan records that a lower bound exists, not which operator supplied it.
- **Leaving out `INDEXED BY` in Q247 or Q248.** With three rows the planner may well prefer a full scan, and the detail becomes `SCAN users`. The hint is what makes the plan deterministic — and it is SQLite-specific syntax.
- **Trying to select the EQP id/parent columns.** `runtime.cjs` recognises the four-column EQP shape and reduces it to `detail`; the expected rows have that one key and nothing else.
- **Assuming `DROP INDEX` deletes rows in Q250.** It removes only the index. The expected `users` count is `3`, unchanged by both the create and the drop.

## Try it yourself

1. Change Q241's index to `ON users(email)` (no `lower`). Which of the two probes now behaves differently, and why does the graded select still match?
2. Run `EXPLAIN QUERY PLAN SELECT id FROM users WHERE email>='B'` with only `tenant_email` present. Does SQLite use the index, and what does the detail say about a composite key without its leading column?
3. Add a second partial index `WHERE active=0` on the same expression. Can both exist at once, and what does `pragma_index_list` report for each?
4. In words: Q241's rule cannot be written as a table-level `UNIQUE(email)` constraint. Say precisely which of the three seeded rows such a constraint would reject, and why the partial index does not.

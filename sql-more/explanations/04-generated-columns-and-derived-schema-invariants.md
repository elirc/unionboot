# Generated columns and derived schema invariants — sql-more Q231–Q240

**What you practise:** declaring columns whose value the database computes, choosing `VIRTUAL` or `STORED`, and hanging constraints off a derived value so the invariant lives in the schema instead of in every query.
**Prerequisites:** [01 JSON document projection and type policy](01-json-document-projection-and-type-policy.md); `CREATE TABLE`, `INSERT ... SELECT`, `UPDATE`; the idea of a `CHECK` and a `UNIQUE` constraint.
**Exercises:** Q231: virtual-line-total, Q232: stored-net-total, Q233: generated-updates-follow-base, Q234: generated-column-write-rejection, Q235: derived-check-nonnegative-net, Q236: generated-normalized-unique-key, Q237: generated-json-extraction, Q238: generated-column-chain, Q239: alter-add-virtual-column, Q240: pragma-table-xinfo-generated-flags.

## The problem in plain words

A **generated column** is a column declared with an expression instead of a value: `total INTEGER GENERATED ALWAYS AS (qty*price)`. You never write to it. SQLite computes it from the other columns of the *same row*, every time it is needed.

There are two storage policies, and the keyword at the end of the declaration picks one:

- `VIRTUAL` (the default when neither word is given) — nothing is written to disk. The expression is evaluated when the column is read.
- `STORED` — the value is computed on insert or update and written into the row.

Both give identical answers. The difference is where the cost sits: `VIRTUAL` costs nothing to write and something to read; `STORED` is the reverse and makes the row bigger.

Why bother, rather than writing `qty*price` in every query? Because a generated column is part of the *schema*, so other schema objects can be built on it. A `CHECK` can reference it (Q235), a `UNIQUE` constraint can enforce a rule on a normalised form of some text (Q236), and an index can be built on it. The invariant then holds for every writer, including writers who forgot about it.

The rest of the family is about the restrictions that come with that. You cannot assign to a generated column. The expression may only use columns of the same row — no subqueries, no aggregates, no other rows. And `ALTER TABLE ... ADD COLUMN` can add a `VIRTUAL` generated column to a populated table but not a `STORED` one.

## The contract you must honour

Taken from `prompts/Q231.txt`–`Q240.txt` and `tests/Q231.cjs`–`Q240.cjs`. All ten share one seed, which supplies only the *base* data; the table under test is created by your own SQL:

```sql
CREATE TABLE source(id INTEGER PRIMARY KEY, qty INTEGER, price INTEGER, discount INTEGER);
INSERT INTO source VALUES(1,2,10,3),(2,0,8,0),(3,3,7,2);
```

- Every answer here is **multi-statement**: a `CREATE TABLE`, usually an `INSERT`, sometimes an `UPDATE` or `ALTER`, and a final `SELECT`. `runtime.cjs` splits on semicolons outside quotes and comments; only the final statement's rows are graded. The earlier statements run for their effect on the disposable database.
- Table and column names are dictated by the prompts and by the integrity probes: `calc` with `total`/`net`/`gross` (Q231–Q235, Q238–Q240), `emails` with `email`/`normalized` (Q236), `records` with `body`/`qty` (Q237).
- Aliases: `id, total` (Q231, Q233, Q234, Q239); `id, net` (Q232, Q235); `id, normalized` (Q236); `id, qty` (Q237); `id, gross, net` (Q238); `name, hidden` (Q240).
- Three exercises carry **post-result integrity assertions**, run by `runtime.cjs` after the rows are compared. They execute a statement and require it to raise an error matching a pattern:
  - Q234: `UPDATE calc SET total=9` must fail matching `generated column`.
  - Q235: `INSERT INTO calc(id,qty,price,discount) VALUES(4,1,2,9)` must fail matching `CHECK`.
  - Q236: `INSERT INTO emails(id,email) VALUES(3,'ADA@X')` must fail matching `UNIQUE`.
  Those statements name your tables and columns, so the schema you create has to match them exactly.
- Q240's expected rows are `{"name":"v","hidden":2}` then `{"name":"s","hidden":3}`, so the virtual column must be declared before the stored one and the query must order by `cid`.

### Generated-column behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session:

- Writing to a generated column raises `cannot UPDATE generated column "total"` or `cannot INSERT into generated column "total"`. Both contain the text `generated column`, which is what Q234's probe matches.
- Because of that, an `INSERT ... SELECT` must name the base columns explicitly: `INSERT INTO calc(id,qty,price) SELECT id,qty,price FROM source`. `INSERT INTO calc SELECT * FROM source` fails when the column counts differ.
- A `CHECK` may reference a generated column. `net INTEGER AS(q*p-d) STORED CHECK(net>=0)` rejects a violating insert with `CHECK constraint failed: net>=0`.
- A `UNIQUE` constraint may sit on a generated column, and it is enforced on the computed value: with `normalized TEXT AS(lower(trim(email))) UNIQUE`, inserting `'ADA@X'` after `' Ada@x '` fails with `UNIQUE constraint failed: emails.normalized`.
- SQLite's `lower()` is **ASCII-only**: `lower('ÄDA@X')` returns `Äda@x`, with the Ä unchanged. So the Q236 normalisation catches `ADA@X` but would not catch an accented duplicate. The prompt says "(ASCII normalization)" for exactly this reason.
- A generated column may be defined in terms of an earlier generated column: `gross INTEGER AS(qty*price)` then `net INTEGER AS(gross-discount)` works (Q238).
- `ALTER TABLE calc ADD COLUMN total INTEGER AS(qty*price) VIRTUAL` succeeds on the populated `calc`. The same statement with `STORED` fails with `cannot add a STORED column`. (On an *empty* table the `STORED` form was accepted in this session — the restriction bites once there are rows to backfill.)
- `pragma_table_xinfo('calc')` is a table-valued form of `PRAGMA table_xinfo`. Its `hidden` column is `0` for an ordinary column, `2` for a `VIRTUAL` generated column and `3` for a `STORED` one. Plain `pragma_table_info` omits virtual generated columns altogether, so `table_xinfo` is the one to use.

## Approach

1. **Write the declaration as `<name> <type> GENERATED ALWAYS AS (<expr>) [VIRTUAL|STORED]`.** The words `GENERATED ALWAYS` are optional — `total INTEGER AS(qty*price)` means the same thing — and `VIRTUAL` is the default.
2. **Choose `STORED` when something else must read the value cheaply or index it**, `VIRTUAL` when it is a convenience projection. Q231 and Q232 differ only in that word plus the expression.
3. **Copy base data by naming base columns.** `INSERT INTO calc(id,qty,price) SELECT id,qty,price FROM source` — never include the generated column on either side.
4. **Let updates take care of themselves** (Q233). Changing `qty` changes `total` with no extra statement, because the value is defined rather than stored by hand.
5. **Attach the invariant to the generated column** (Q235, Q236). `CHECK(net>=0)` inside the column definition and `UNIQUE` after it both read the computed value.
6. **Use a generated column to expose a JSON field as a real column** (Q237). `qty INTEGER AS(json_extract(body,'$.qty'))` gives you a typed column that indexes and constrains like any other, and a document that lacks the key simply yields NULL.
7. **Chain derivations** (Q238) when one derived value feeds another; declare them in dependency order.
8. **Add a virtual column to an existing table with `ALTER TABLE`** (Q239) when the table is already populated; `CREATE TABLE calc AS SELECT * FROM source` makes the copy first.
9. **Introspect with `pragma_table_xinfo`** (Q240) when the question is about the schema rather than the data, filtering `hidden>0` to keep only generated columns and ordering by `cid` to keep declaration order.

## Worked example — Q231 virtual-line-total

The task, quoted from `prompts/Q231.txt`: "Create calc(id,qty,price,total generated ALWAYS AS(qty*price) VIRTUAL), copy source base columns, select id,total."

**Step 1 — the seed rows in `source`.**

| id | qty | price | discount |
| --- | --- | --- | --- |
| 1 | 2 | 10 | 3 |
| 2 | 0 | 8 | 0 |
| 3 | 3 | 7 | 2 |

**Step 2 — `CREATE TABLE calc(...)`.** Four columns are declared, but only three of them accept writes. `discount` is deliberately not copied: this scenario is about the gross total.

**Step 3 — `INSERT INTO calc(id,qty,price) SELECT id,qty,price FROM source`.** The column list on the left has to exclude `total`; naming it would raise `cannot INSERT into generated column "total"`. Nothing is written for `total` — with `VIRTUAL` there is no storage for it at all.

| calc.id | qty | price |
| --- | --- | --- |
| 1 | 2 | 10 |
| 2 | 0 | 8 |
| 3 | 3 | 7 |

**Step 4 — `SELECT id,total FROM calc`.** Reading `total` evaluates `qty*price` for each row, now.

| id | qty*price | total |
| --- | --- | --- |
| 1 | 2 × 10 | 20 |
| 2 | 0 × 8 | 0 |
| 3 | 3 × 7 | 21 |

Row 2 shows that `0` is a real answer, not a missing one: nothing about the generated column turns a zero into NULL.

**Step 5 — `ORDER BY id`.** Required, as always, because the comparison is positional.

**The asserted result**, from `tests/Q231.cjs`:

```sql
-- [{"id":1,"total":20},{"id":2,"total":0},{"id":3,"total":21}]
```

The reference solution as it now reads in `solutions/Q231.sql`:

```sql
-- Why this works:
-- A generated column is declared with an expression instead of a value, so
-- total is never written; SQLite computes qty*price when it is read.
-- VIRTUAL means nothing is stored on disk for total, which is the cheapest
-- choice when the value is only projected and never indexed.
-- The INSERT names only the base columns: naming total would raise
-- cannot INSERT into generated column.
-- discount is deliberately not copied, because this scenario reports the
-- gross line total.
CREATE TABLE calc(
  id INTEGER PRIMARY KEY,
  qty INTEGER,
  price INTEGER,
  total INTEGER GENERATED ALWAYS AS (qty*price) VIRTUAL
);
INSERT INTO calc(id, qty, price)
SELECT id,
       qty,
       price
FROM source;
SELECT id,
       total
FROM calc
ORDER BY id;
```

**Contrast with Q232**, which changes two things at once: the expression subtracts `discount`, so the table must copy that column too, and the storage policy becomes `STORED`, so the computed `net` is written into each row at insert time. The output shape is the same; nothing in the result reveals which storage policy was used. Q240 is the exercise that makes the difference observable, by asking the schema instead of the data.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q231 | virtual-line-total | "total … VIRTUAL" | `total INTEGER GENERATED ALWAYS AS (qty*price) VIRTUAL` |
| Q232 | stored-net-total | "STORED net=qty*price-discount" | expression subtracts `discount`; keyword becomes `STORED`; `discount` is copied |
| Q233 | generated-updates-follow-base | "change id1 qty to 4" | adds `UPDATE calc SET qty=4 WHERE id=1` before the select |
| Q234 | generated-column-write-rejection | "direct assignment to total is rejected" | a single literal `INSERT`; the probe supplies the failing `UPDATE` |
| Q235 | derived-check-nonnegative-net | "CHECK(net>=0) … excessive discount must fail" | the column definition gains `CHECK(net>=0)` |
| Q236 | generated-normalized-unique-key | "normalized lower(trim(email)) UNIQUE" | a different table: `normalized TEXT AS(lower(trim(email))) UNIQUE` |
| Q237 | generated-json-extraction | "generated integer qty extracted from JSON" | the expression is `json_extract(body,'$.qty')`; a missing key yields NULL |
| Q238 | generated-column-chain | "net=gross-discount" | two generated columns, the second referencing the first |
| Q239 | alter-add-virtual-column | "ALTER TABLE ADD COLUMN virtual total" | `CREATE TABLE calc AS SELECT * FROM source` then `ALTER TABLE ... ADD COLUMN` |
| Q240 | pragma-table-xinfo-generated-flags | "report hidden flags (2 virtual, 3 stored)" | no data at all: `SELECT name,hidden FROM pragma_table_xinfo('calc') WHERE hidden>0` |

## Pitfalls the tests are designed to catch

- **`INSERT INTO calc SELECT * FROM source`.** `source` has four columns and `calc` has three writable ones, so the counts disagree and the statement fails. Q232 and Q238 can use `SELECT *` only because they copy all four base columns.
- **Listing the generated column in the insert.** Raises `cannot INSERT into generated column`. Q234's probe deliberately triggers the `UPDATE` form of the same restriction, so the table must still be a generated-column table and not a plain one with a manually computed total.
- **Computing the value by hand "just to be safe" in Q233.** An extra `UPDATE calc SET total=...` fails outright, and it is unnecessary: the whole point is that the derived value follows its base columns with no second write.
- **Making `net` an ordinary column with a `CHECK` in Q235.** The probe inserts `(4,1,2,9)` without naming `net`; on a plain column `net` would be NULL, `NULL>=0` is unknown, and SQLite treats an unknown `CHECK` as satisfied — so the insert would succeed and the probe would fail.
- **Relying on `lower()` for non-ASCII text in Q236.** SQLite's built-in `lower()` and the `NOCASE` collation only fold ASCII letters. The probe uses `ADA@X`, which is ASCII, so it passes — but the same schema would admit an accented near-duplicate.
- **Forgetting `trim` in Q236.** The first email is `' Ada@x '` with spaces; without `trim` the normalised value keeps them, the expected `"ada@x"` fails, and the probe's `ADA@X` would no longer collide.
- **Expecting Q237's second row to be `0`.** The document is `{}`, `json_extract` returns SQL NULL, and the declared type `INTEGER` does not coerce it. The expected row is `{"id":2,"qty":null}`.
- **Declaring the chain in the wrong order in Q238.** `net` references `gross`, so `gross` must be declared first; a forward reference is rejected when the table is created.
- **Using `STORED` in Q239.** `ALTER TABLE` on the already-populated `calc` fails with `cannot add a STORED column`, which is what the prompt's last sentence warns about. `VIRTUAL` is accepted because there is nothing to backfill.
- **Using `pragma_table_info` in Q240.** It does not list `VIRTUAL` generated columns and has no `hidden` column, so the query returns the wrong rows or does not compile. `pragma_table_xinfo` is the extended form.
- **Dropping the `WHERE hidden>0` or the `ORDER BY cid` in Q240.** Without the filter the ordinary `qty` and `price` rows appear; without the ordering the declaration order is not guaranteed, and the expected rows are `v` before `s`.
- **Assuming a generated expression may look at other rows.** It may not: no subqueries, no aggregates, no references to other tables. Everything in this family is a row-local expression for that reason.

## Try it yourself

1. Change Q231's column to `STORED` and re-run. Does any expected row change? Now run Q240 against your table — which number moves?
2. Add `CREATE INDEX ON calc(total)` for both the virtual and the stored version. Does SQLite allow both, and what does `EXPLAIN QUERY PLAN SELECT id FROM calc WHERE total=20` report?
3. Extend Q237 with a `CHECK(qty IS NULL OR qty>=0)`. Which of the two seeded documents does it have to let through?
4. In words: Q235 puts the rule in the schema and Q232 leaves it to the caller. Describe one bug that the schema version prevents and the query version does not.

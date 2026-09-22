# SQLite schema constraints and integrity — sql-200 Q121–Q130

**What you practise:** declaring tables whose rules are enforced by the database — `NOT NULL`, `CHECK`, `UNIQUE`, foreign keys, `STRICT` — and knowing which SQLite quirk each one has.
**Prerequisites:** [09 NULL semantics and three valued logic](09-null-semantics-and-three-valued-logic.md), because a `CHECK` constraint is an exercise in three-valued logic; `CREATE TABLE` and `INSERT`; the idea that a constraint is checked on every write, not once.
**Exercises:** Q121: integer-primary-key-rowid-alias, Q122: not-null-and-check-positive, Q123: unique-email-case-sensitive, Q124: unique-email-nocase-ascii, Q125: composite-primary-key-without-rowid, Q126: foreign-key-restrict, Q127: foreign-key-cascade-delete, Q128: check-enum-and-boolean-integer, Q129: strict-table-reject-text-numeric, Q130: nullable-check-three-valued-acceptance.

## The problem in plain words

Every other family in this track reads or rewrites data. This one writes the *schema*: each exercise creates a table, puts a couple of rows in it, and returns them. The interesting part is not the rows — it is what the table refuses.

The tests check that in two ways. The final `SELECT` proves the legal rows went in. Then the grader runs **probes**: extra statements defined in `tests/Qxxx.cjs` under a `probes` key, each with a `reject` pattern. `assert.throws(()=>db.exec(p.sql), new RegExp(p.reject))` means "this statement must fail, and its error message must contain this text". So `"reject":"NOT NULL"` does not merely require a failure; it requires a NOT NULL failure specifically. Declaring `CHECK(name<>'')` instead of `NOT NULL` would fail the wrong way and the probe would not pass.

Three of the ten exercises are about SQLite peculiarities that do not transfer to other engines: `INTEGER PRIMARY KEY` being an alias for the hidden rowid (Q121), `WITHOUT ROWID` being what finally makes primary-key columns non-nullable (Q125), and `STRICT` being opt-in rather than the default (Q129). The GUIDE lists these under "SQLite-specific caveats"; the exercises make them concrete.

The seed gives you one table to point a foreign key at, and nothing else:

```sql
CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);
```

Everything else in this family is created by your own submission.

## The contract you must honour

- The submission is a small script: `CREATE TABLE …; INSERT …; SELECT …;`. The runner splits on semicolons outside quotes and comments and grades only the last statement's rows, so the `SELECT` must come last.
- The runner has already issued `PRAGMA foreign_keys=ON` before your SQL runs. Without it SQLite parses `REFERENCES` and then ignores it; with it, Q126 and Q127 behave as written.
- Table and column names are fixed by the prompts, because the probes reference them: `items(id,name)`, `stock(sku,qty)`, `users(id,email)`, `membership(user_id,team_id,role)`, `workers(id,dept_id)`, `flags(id,status,enabled)`, `amounts(id,value)`, `optional_scores(id,score)`.
- Aliases and row counts, as asserted in the tests: Q121 returns `{"id":1,"name":"One"}` — the id was never supplied, so 1 is SQLite's choice. Q122 returns `A/0` and `B/3`. Q123 returns two rows, Q124 one. Q125 returns two rows ordered by `user_id, team_id`. Q126 returns `{"id":1,"dept_id":10}`, Q127 returns only worker 2. Q128 returns both flag rows with `enabled` as the numbers 0 and 1. Q129 returns `{"id":1,"value":7}`. Q130 returns `{"id":1,"score":null}` and `{"id":2,"score":0}`.
- The probes, quoted from the tests, are the other half of the contract:
  - Q121: inserting a NULL name must fail with `NOT NULL`; `SELECT rowid,id FROM items` must return `[{"id":1}]`.
  - Q122: `('C',-1)` must fail with `CHECK`; `('C',NULL)` must fail with `NOT NULL`.
  - Q123: a second `'Ada@x'` must fail with `UNIQUE`.
  - Q124: `'ada@x'` must fail with `UNIQUE`, although Q123 accepted it.
  - Q125: a repeat of `(1,10,…)` must fail with `UNIQUE`; `(NULL,10,…)` must fail with `NOT NULL`.
  - Q126: a worker in department 99 must fail with `FOREIGN KEY`; deleting department 10 must fail with `FOREIGN KEY`.
  - Q127: after deleting department 20, `SELECT COUNT(*) AS remaining FROM workers` must be `[{"remaining":0}]`.
  - Q128: status `'other'` must fail with `CHECK`; `enabled` 2 must fail with `CHECK`.
  - Q129: `(2,'seven')` must fail with `cannot store TEXT`.
  - Q130: `-1` must fail with `CHECK`, while a second NULL score must still be accepted and read back as `null`.

## Approach

1. **Write the constraint the probe names.** Work backwards from the `reject` string: `NOT NULL` means a `NOT NULL` clause, `CHECK` means a `CHECK(...)`, `UNIQUE` means a `UNIQUE` constraint or a primary key, `FOREIGN KEY` means `REFERENCES`, `cannot store TEXT` means `STRICT`.
2. **Let SQLite assign the key where the exercise is about the rowid.** Declare `id INTEGER PRIMARY KEY` and omit the column from the `INSERT` column list.
3. **Say what a column may not hold, separately from what it must look like.** `NOT NULL` and `CHECK` are different constraints with different error messages; Q122 probes both.
4. **Pick the collation deliberately.** A `TEXT` column with no `COLLATE` clause uses `BINARY`, so uniqueness is byte-exact. `COLLATE NOCASE` on the column makes the `UNIQUE` index case-insensitive for ASCII.
5. **Name every column of a composite key** in the `PRIMARY KEY(…)` clause, and add `WITHOUT ROWID` when the exercise requires the key columns to reject NULL.
6. **Choose the foreign-key action from the requirement.** "The parent may not disappear while children exist" is `ON DELETE RESTRICT`; "children go with the parent" is `ON DELETE CASCADE`.
7. **Model an enumeration with `CHECK(col IN ('a','b'))` and a boolean with `CHECK(col IN (0,1))`**, quoting the literals with single quotes.
8. **Reach for `STRICT` when the declared type must be enforced**, and remember it limits you to the type names `INT`, `INTEGER`, `REAL`, `TEXT`, `BLOB` and `ANY`.
9. **Remember that `CHECK` permits NULL.** Only a condition that evaluates to *false* rejects a row; unknown passes. Add `NOT NULL` if you also want to forbid the missing value.

## Worked example — Q121 integer-primary-key-rowid-alias

The task, quoted from the prompt: "SQLite-specific: create items(id INTEGER PRIMARY KEY,name TEXT NOT NULL). Insert One without id, then select id,name ordered by id. The grader also checks generated id and required name."

**Statement 1 — `CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT NOT NULL);`**

Every SQLite table (unless declared `WITHOUT ROWID`) has a hidden 64-bit integer key called the rowid. A column declared with exactly the type `INTEGER` and exactly `PRIMARY KEY` does not get a column of its own: it becomes another name for that rowid. `BIGINT PRIMARY KEY` or `INTEGER PRIMARY KEY DESC` would not — they create an ordinary indexed column.

**Statement 2 — `INSERT INTO items(name) VALUES('One');`**

The column list names only `name`, so `id` is left to SQLite. For an empty table the next rowid is 1.

| rowid / id | name |
| --- | --- |
| 1 | `'One'` |

**Statement 3 — `SELECT id, name FROM items ORDER BY id;`** — the graded statement.

| id | name |
| --- | --- |
| 1 | `'One'` |

`tests/Q121.cjs` asserts exactly `[{"id":1,"name":"One"}]`.

**The probes.** `INSERT INTO items(name) VALUES(NULL)` must raise an error matching `NOT NULL`; SQLite's message is `NOT NULL constraint failed: items.name`. The second probe, `SELECT rowid,id FROM items`, expects the single-key object `[{"id":1}]` — and it really does come back with one key, because SQLite reports both output columns under the name `id`: `rowid` is not a separate column here, it is the same one. That is the alias, demonstrated.

The reference solution, as it now reads in `solutions/Q121.sql`:

```sql
-- Why this works:
-- A column declared exactly INTEGER PRIMARY KEY is an alias for the hidden
-- rowid, not a separate column, so SQLite fills it in automatically.
-- The INSERT names only (name), so id is omitted and SQLite assigns the
-- next rowid, 1, for the first row of an empty table.
-- NOT NULL on name makes the grader's INSERT of a NULL name fail with a
-- NOT NULL constraint error.
-- The final SELECT is the graded statement; the CREATE and INSERT before it
-- only set up this disposable database.
CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO items(name) VALUES('One');
SELECT id, name
FROM items
ORDER BY id;
```

**The Q123/Q124 contrast.** The two statements differ by three words. Q123's `email TEXT NOT NULL UNIQUE` compares with `BINARY` collation, so `'Ada@x'` and `'ada@x'` are different values and both rows are stored. Q124's `email TEXT NOT NULL COLLATE NOCASE UNIQUE` makes the unique index compare case-insensitively, so the second spelling collides and the table holds one row. The stored text is unchanged in both cases — collation decides how values are *compared*, never how they are written.

## Policy matrix — what changes between the variants

| ID | Variant | What the exercise must reject | What changes in the SQL |
| --- | --- | --- | --- |
| Q121 | integer-primary-key-rowid-alias | a NULL name | `id INTEGER PRIMARY KEY` plus `name TEXT NOT NULL`; the `INSERT` omits `id` |
| Q122 | not-null-and-check-positive | negative *and* missing quantity | `qty INTEGER NOT NULL CHECK(qty>=0)` |
| Q123 | unique-email-case-sensitive | only a byte-identical repeat | `email TEXT NOT NULL UNIQUE` (default `BINARY`) |
| Q124 | unique-email-nocase-ascii | a differently-cased repeat | the same line plus `COLLATE NOCASE` before `UNIQUE` |
| Q125 | composite-primary-key-without-rowid | a repeated pair, and a NULL key part | `PRIMARY KEY(user_id,team_id)` and the table is `WITHOUT ROWID` |
| Q126 | foreign-key-restrict | an orphan child, and deleting a used parent | `REFERENCES departments(id) ON DELETE RESTRICT` |
| Q127 | foreign-key-cascade-delete | nothing — it deletes children instead | the same clause with `ON DELETE CASCADE`, plus a `DELETE` on the parent |
| Q128 | check-enum-and-boolean-integer | an unknown status, and a boolean of 2 | two `CHECK(col IN (…))` constraints |
| Q129 | strict-table-reject-text-numeric | text in an integer column | the table is declared `STRICT` |
| Q130 | nullable-check-three-valued-acceptance | a negative score, but *not* a NULL one | `CHECK(score>=0)` with no `NOT NULL` |

## Pitfalls the tests are designed to catch

- **Supplying the id in Q121.** `INSERT INTO items VALUES(1,'One')` produces the same row, but it does not demonstrate the rowid alias, and it breaks the moment the prompt's "insert One without id" is taken seriously by a reviewer.
- **Declaring `id INT PRIMARY KEY`.** `INT` is not `INTEGER` for this rule. The column is then an ordinary one and is not auto-filled, so an omitted `id` is stored as NULL and the expected `{"id":1}` fails.
- **Using `CHECK(qty IS NOT NULL)` instead of `NOT NULL` in Q122.** The insert of `('C',NULL)` would then fail with a `CHECK` message, and the probe requires one containing `NOT NULL`.
- **Expecting a `PRIMARY KEY` column to reject NULL.** In an ordinary rowid table, SQLite allows NULL in a `PRIMARY KEY` column that is not an `INTEGER PRIMARY KEY` — a documented compatibility wart. Q125's NULL probe passes only because the table is `WITHOUT ROWID`.
- **Forgetting `PRAGMA foreign_keys`.** The runner enables it, but if you test your SQL by hand in another tool with the pragma off, Q126's probes appear to pass locally and fail here.
- **Choosing the wrong foreign-key action.** With `CASCADE`, Q126's second probe would succeed in deleting department 10 rather than failing, and the `assert.throws` would report "Missing expected exception".
- **Double-quoting the enum literals in Q128.** SQLite resolves `"draft"` as an identifier first and only falls back to a string literal if no such column exists. `CHECK(status IN("draft","live"))` happens to work here and is a trap elsewhere; single quotes always mean text.
- **Relying on a column type to enforce a type.** Without `STRICT`, `INSERT INTO amounts VALUES(2,'seven')` stores the text `'seven'` in an `INTEGER` column quite happily — SQLite's dynamic typing means the declared type is only an affinity. Q129 probes exactly that.
- **Adding `NOT NULL` to Q130.** The second probe inserts a NULL score and expects it to be stored and read back as `null`. `NOT NULL` would turn that into a failure.
- **Believing a `CHECK` rejects NULL.** `NULL >= 0` is unknown, and a constraint rejects a row only when the condition is false. Q130 is built entirely on that rule; Q122 needs a separate `NOT NULL` for the same reason.
- **Putting the `SELECT` anywhere but last.** Only the final statement's rows are graded; a `SELECT` followed by an `INSERT` returns the insert's empty result and fails the non-empty expectation.

## Try it yourself

1. Change Q124's column to `COLLATE NOCASE` on the table's `UNIQUE` constraint rather than on the column (`UNIQUE(email COLLATE NOCASE)`), and check that the probe still passes. Which form also affects `WHERE email='ada@x'`?
2. Add `ON DELETE SET NULL` as a third variant of the foreign-key exercises. What must be true of the `dept_id` column for it to be legal, and what would `SELECT id,dept_id FROM workers` then return after deleting department 10?
3. Write a `CHECK` for Q130 that allows NULL and 0 but forbids both negatives and values above 100, and say how many rows of the probe set change.
4. In words: Q125's NULL probe expects a `NOT NULL` error although no column says `NOT NULL`. Explain where that constraint comes from, and what would happen without `WITHOUT ROWID`.

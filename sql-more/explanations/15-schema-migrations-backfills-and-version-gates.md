# Schema migrations backfills and version gates — sql-more Q341–Q350

**What you practise:** changing a live schema with `ALTER TABLE`, filling the new columns from the old ones, rebuilding a table when `ALTER` is not enough, and tracking which migration has run with `PRAGMA user_version`.
**Prerequisites:** [sql-200 13 SQLite schema constraints and integrity](../../sql-200/explanations/13-sqlite-schema-constraints-and-integrity.md); [sql-200 15 Transactions savepoints and atomic state](../../sql-200/explanations/15-transactions-savepoints-and-atomic-state.md); [sql-200 11 String normalization parsing and matching](../../sql-200/explanations/11-string-normalization-parsing-and-matching.md) for `instr`, `substr` and `GLOB`.
**Exercises:** Q341: add-column-default-backfill, Q342: rename-column-preserve-data, Q343: backfill-first-token, Q344: safe-numeric-backfill, Q345: rebuild-with-check-constraint, Q346: version-bump-transaction, Q347: rollback-migration-version-and-ddl, Q348: normalize-child-table-migration, Q349: drop-obsolete-column, Q350: migration-audit-row-count.

## The problem in plain words

A **migration** is a scripted change to a database that already contains data. The change has two halves that are easy to confuse. The *schema* half adds, renames or removes columns and tables. The *data* half — the **backfill** — puts sensible values into whatever the schema half created, derived from what was already there.

The seed here is a small table with the two classic legacy problems: a person's whole name in one text column, and a number stored as text with a non-numeric escape hatch (`'unknown'`). Splitting the name and typing the age are the two backfills, and they are the exercises where getting it slightly wrong produces plausible, wrong data rather than an error.

SQLite's `ALTER TABLE` is limited compared with other engines: it can add a column, rename a column, rename the table, and drop a column, and nothing else. There is no "add a `CHECK` constraint" and no "change a column's type". The answer when you need one of those is the **table rebuild**: create the new table beside the old one, copy the rows, drop the old, rename the new — all inside one transaction. Q345 is that pattern in full.

The last piece is the **version gate**. `PRAGMA user_version` is a 32-bit integer stored in the database header that SQLite itself never reads. Migration tools use it as a counter: "this database is at version 1, so migration 2 still has to run." Q346 advances it as part of the migration; Q347 shows what happens when the migration is rolled back instead.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q341.txt`:

```sql
CREATE TABLE customers(id INTEGER PRIMARY KEY,full_name TEXT,age_text TEXT);
INSERT INTO customers VALUES(1,'Ada Lovelace','36'),(2,'Bo Li','20'),(3,'Cy','unknown');
PRAGMA user_version=1;
```

- Three rows. Two names contain a space, one (`'Cy'`) does not — that is the edge case Q343 and Q348 have to handle. Two ages are all digits, one is the word `unknown`.
- `PRAGMA user_version=1` is part of the seed, so every scenario starts from version 1.
- Aliases are graded: Q341 returns `id, tier`; Q342 returns `id, display_name`; Q343 returns `id, given_name`; Q344 returns `id, age`; Q345 returns `id, name`; Q346 and Q347 return `version` plus `customers` or `tier_columns`; Q348 returns `customer_id, given_name`; Q349 returns `name`; Q350 returns `version, copied`.
- Q344's expected third row is `{"id":3,"age":null}` — a NULL, explicitly not a zero. `CAST('unknown' AS INTEGER)` returns `0` in SQLite (checked against 3.49.1), and the prompt names that as the behaviour to avoid.
- Q345 is graded on the three rebuilt rows **and** on a probe: `INSERT INTO customers VALUES(4,'')` must fail matching `CHECK`. So the rebuilt table must still be called `customers`, must take two columns in the order `(id, name)`, and must carry the length constraint.
- Q347's expected row is `{"version":1,"tier_columns":0}`. Both halves of the rolled-back migration must be gone: the version back at 1 *and* the column absent.
- Q348 says "keep source table": `customers` must survive, with `full_name` intact.
- Q349's expected rows are `id` then `full_name`, in that order, and the prompt says "in schema order" — so the ordering column is `cid`, the column index, not the name.
- Q350 expects one row, `{"version":2,"copied":3}`, from a table the submission creates.

## Approach

1. **Add a column with its default in one statement.** `ALTER TABLE customers ADD COLUMN tier TEXT NOT NULL DEFAULT 'basic'` gives existing rows the default immediately. A `NOT NULL` column may only be added this way — without a default, SQLite refuses, because the existing rows would instantly violate it.
2. **Rename rather than add-and-copy when only the name is wrong.** `ALTER TABLE … RENAME COLUMN full_name TO display_name` keeps the data in place and updates references elsewhere in the schema.
3. **Backfill in a separate `UPDATE`.** Add the column, then compute its values. The two steps are separate statements because `ALTER TABLE` takes a constant default, not an expression over the row.
4. **Find a delimiter with `instr`, then cut with `substr`.** `instr(s, ' ')` returns the 1-based position of the first space, or `0` when there is none. `substr(s, 1, instr(s,' ') - 1)` is everything before it. The zero case has to be handled separately: with no space, `substr(s,1,-1)` returns the empty string, not the whole value.
5. **Validate before casting.** `CAST` never fails in SQLite; it converts what it can and returns `0` for text with no leading number. Guard it: `age_text <> '' AND age_text NOT GLOB '*[^0-9]*'` is true only for a non-empty string of digits. `GLOB` is case-sensitive wildcard matching where `*` is any run of characters and `[^0-9]` is any one character that is not a digit, so `'*[^0-9]*'` means "contains a non-digit". (Verified: `'36' NOT GLOB '*[^0-9]*'` is 1, `'unknown'` is 0, `'12abc'` is 0.)
6. **Let a `CASE` with no `ELSE` produce the NULL.** When the guard is false the `CASE` yields NULL, which is exactly the "unknown age" the expectation wants. Writing `ELSE 0` would produce the wrong answer the prompt warns about.
7. **Rebuild a table in four statements inside one transaction.** Create the new shape, `INSERT … SELECT` the surviving columns, `DROP` the old, `ALTER TABLE … RENAME TO` the old name. `BEGIN`/`COMMIT` makes the window in which the table does not exist invisible.
8. **Treat `PRAGMA user_version` as part of the migration.** Set it inside the same transaction as the DDL. SQLite's DDL is transactional, so a `ROLLBACK` undoes the added column and the version bump together — which is what Q347 asserts.
9. **Read schema facts with table-valued pragmas.** `pragma_table_info('customers')` returns one row per column with `cid`, `name`, `type` and more; `pragma_user_version` returns one row with a `user_version` column. Both can be used in a `FROM` clause like tables.

## Worked example — Q344 safe-numeric-backfill

The task, quoted from the prompt: "Add age INTEGER; convert only nonempty all-digit age_text, unknown becomes NULL instead of SQLite CAST unknown->0."

**Step 1 — add the column.** `ALTER TABLE customers ADD COLUMN age INTEGER` gives every existing row `age` NULL. There is no default, and that is deliberate: NULL is the correct starting value for "not yet computed".

**Step 2 — see what the naive conversion would do.**

| id | age_text | `CAST(age_text AS INTEGER)` |
| --- | --- | --- |
| 1 | `'36'` | 36 |
| 2 | `'20'` | 20 |
| 3 | `'unknown'` | **0** |

SQLite's `CAST` to `INTEGER` reads as many leading numeric characters as it can and yields `0` when there are none. It does not raise an error. Row 3 would silently become a 0-year-old customer.

**Step 3 — build the guard.** Two conditions, both required:

| test | `'36'` | `'20'` | `'unknown'` | `''` (not in this seed) |
| --- | --- | --- | --- | --- |
| `age_text <> ''` | true | true | true | false |
| `age_text NOT GLOB '*[^0-9]*'` | true | true | false | true |
| both | **true** | **true** | false | false |

The empty-string test is needed because `'' NOT GLOB '*[^0-9]*'` is true — an empty string contains no non-digit — while `CAST('' AS INTEGER)` is `0`.

**Step 4 — the `CASE` without an `ELSE`.**

```sql
CASE WHEN age_text <> '' AND age_text NOT GLOB '*[^0-9]*'
     THEN CAST(age_text AS INTEGER)
END
```

Rows 1 and 2 take the `THEN` branch. Row 3 falls off the end of the `CASE`, and a `CASE` with no matching branch and no `ELSE` evaluates to NULL. The `UPDATE` therefore writes NULL into row 3's `age`.

**Step 5 — the expected result**, asserted in `tests/Q344.cjs`:

```json
[{"id":1,"age":36},{"id":2,"age":20},{"id":3,"age":null}]
```

The reference solution, as it now reads in `solutions/Q344.sql`:

```sql
-- Why this works:
-- ALTER TABLE can add a column but cannot compute its values, so the
-- migration is two statements: widen the schema, then backfill.
-- CAST never fails in SQLite. CAST('unknown' AS INTEGER) is 0, not an error
-- and not NULL, so an unguarded conversion would invent an age of zero.
-- The guard is therefore a validity test run before the cast. GLOB is
-- case-sensitive wildcard matching: '*[^0-9]*' means "contains at least one
-- character that is not a digit", so NOT GLOB accepts only digit strings.
-- The empty string passes that test -- it contains no non-digit -- so
-- age_text <> '' is the second half of the guard.
-- The CASE has no ELSE, so a row that fails the guard yields NULL, which is
-- the correct representation of an age nobody recorded.
ALTER TABLE customers ADD COLUMN age INTEGER;
UPDATE customers
SET age = CASE
            WHEN age_text <> '' AND age_text NOT GLOB '*[^0-9]*'
              THEN CAST(age_text AS INTEGER)
          END;
SELECT id,
       age
FROM customers
ORDER BY id;
```

**Q343's parallel edge case.** The name split has the same shape — a general rule plus one value that breaks it.

| id | full_name | `instr(full_name,' ')` | branch taken | given_name |
| --- | --- | --- | --- | --- |
| 1 | `'Ada Lovelace'` | 4 | `substr(name,1,3)` | `'Ada'` |
| 2 | `'Bo Li'` | 3 | `substr(name,1,2)` | `'Bo'` |
| 3 | `'Cy'` | **0** | whole value | `'Cy'` |

Without the `instr(...) = 0` branch, row 3 would evaluate `substr('Cy',1,-1)`, whose third argument is negative; the result is the empty string, and the expected `'Cy'` becomes `''`.

## Policy matrix — what changes between the variants

| ID | Variant | The migration step | What changes in the SQL |
| --- | --- | --- | --- |
| Q341 | add-column-default-backfill | widen with a constant | `ADD COLUMN tier TEXT NOT NULL DEFAULT 'basic'` |
| Q342 | rename-column-preserve-data | rename in place | `RENAME COLUMN full_name TO display_name` |
| Q343 | backfill-first-token | widen then derive text | `ADD COLUMN` plus an `UPDATE` with `instr`/`substr` |
| Q344 | safe-numeric-backfill | widen then derive a number | the same shape with a `GLOB` guard around `CAST` |
| Q345 | rebuild-with-check-constraint | change what `ALTER` cannot | create, copy, drop, rename, inside `BEGIN`/`COMMIT` |
| Q346 | version-bump-transaction | schema change plus version gate | `BEGIN; ALTER …; PRAGMA user_version=2; COMMIT;` |
| Q347 | rollback-migration-version-and-ddl | the same, abandoned | `ROLLBACK` instead of `COMMIT`; report from pragmas |
| Q348 | normalize-child-table-migration | move a column into a child table | `CREATE TABLE … REFERENCES`, `INSERT … SELECT`, source kept |
| Q349 | drop-obsolete-column | narrow the table | `DROP COLUMN age_text`, then `pragma_table_info` ordered by `cid` |
| Q350 | migration-audit-row-count | record what the migration did | `CREATE TABLE … AS SELECT`, an audit table, `INSERT … SELECT 2, COUNT(*)` |

## Pitfalls the tests are designed to catch

- **Casting without a guard.** Q344's row 3 becomes `0` instead of `null`, and the third expected row fails. The prompt names this explicitly.
- **Testing only the `GLOB` pattern.** `'' NOT GLOB '*[^0-9]*'` is true, so an empty `age_text` would pass the pattern test and cast to `0`. Both halves of the guard are needed.
- **Writing `ELSE 0` or `ELSE -1`.** Any sentinel other than NULL is a value that later arithmetic will happily average. NULL is the only representation of "not known" that aggregates skip.
- **Forgetting the no-space branch in Q343 and Q348.** `substr('Cy', 1, instr('Cy',' ') - 1)` is `substr('Cy',1,-1)`, which returns the empty string. The expected value is `'Cy'`.
- **Adding a `NOT NULL` column without a default.** SQLite rejects it with `Cannot add a NOT NULL column with default value NULL`, because the three existing rows would immediately violate the constraint. Q341's `DEFAULT 'basic'` is what makes the statement legal.
- **Trying to add a `CHECK` constraint with `ALTER TABLE`.** SQLite has no such form. Q345 needs the rebuild, and the probe — `INSERT INTO customers VALUES(4,'')` must fail matching `CHECK` — is what proves the new constraint is really there.
- **Leaving the rebuilt table under its temporary name.** After `DROP TABLE customers`, the new table must be renamed to `customers`, or both the graded `SELECT` and the probe address a table that no longer exists.
- **Copying `age_text` into the rebuilt table.** Q345 says "discard age_text", and its probe inserts a two-column row `(4,'')`. A three-column table would fail the probe with a column-count error, not with `CHECK`.
- **Committing Q347.** The scenario is the rolled-back migration: the expected version is 1 and the expected `tier_columns` is 0. SQLite's DDL participates in transactions, so `ROLLBACK` removes the added column as well as the version change — if you `COMMIT` by habit, both halves of the assertion fail.
- **Dropping the source table in Q348.** The prompt says to keep it. The child table references `customers(id)`, and with `PRAGMA foreign_keys=ON` the reference has to remain satisfiable.
- **Ordering Q349 by `name`.** The prompt asks for schema order, which is `cid` — 0 for `id`, 1 for `full_name`. Alphabetical order would put `full_name` first.
- **Assuming `DROP COLUMN` always works.** SQLite added `ALTER TABLE DROP COLUMN` in 3.35 and refuses it for a column that is part of the primary key, is indexed, or is referenced by a constraint or view. `age_text` is none of those, which is why Q349 can use it.
- **Hard-coding `copied` in Q350.** The audit row is produced by `INSERT INTO migration_audit SELECT 2, COUNT(*) FROM snapshot`, so the count is measured from the copy rather than asserted by the author. That is the point of an audit row.
- **Reading `user_version` with a bare `PRAGMA` as the final statement.** `PRAGMA user_version;` does return a row, but its column is named `user_version`; the graded aliases are `version` and `tier_columns`, which is why the references select from `pragma_user_version` and alias the column.

## Try it yourself

1. Add `INSERT INTO customers VALUES(4,'',' ');` to the seed in your head and work out what Q343, Q344 and Q345 each produce for id 4.
2. Rewrite Q344's guard using `typeof(age_text + 0)` instead of `GLOB`. Does it classify `'12abc'` the same way? Check against the live database before answering.
3. Write the migration that Q345 would need if the new table also had to keep `age_text` as a proper `INTEGER age`. Which of the earlier exercises does it reuse?
4. In words: Q346 and Q347 run the same three statements and differ only in the last word. Explain what a migration tool would conclude from each database afterwards, and why the version gate and the schema must move together.

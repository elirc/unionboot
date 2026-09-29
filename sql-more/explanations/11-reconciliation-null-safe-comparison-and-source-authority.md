# Reconciliation null safe comparison and source authority — sql-more Q301–Q310

**What you practise:** comparing two snapshots of the same keyed data, deciding which side wins, and doing it with an operator that treats NULL as a value rather than as an unknown.
**Prerequisites:** [sql-200 09 NULL semantics and three valued logic](../../sql-200/explanations/09-null-semantics-and-three-valued-logic.md); `LEFT JOIN` and `NOT EXISTS`; [sql-200 14 UPSERT conflict targets](../../sql-200/explanations/14-upsert-conflict-targets-and-merge-policy.md) for the three write scenarios at the end.
**Exercises:** Q301: remote-only-inserts, Q302: local-only-deletions, Q303: changed-shared-values-null-safe, Q304: unchanged-shared-including-null, Q305: change-classification, Q306: remote-authoritative-snapshot, Q307: numeric-delta-known-shared, Q308: apply-remote-full-mirror, Q309: append-only-do-not-overwrite, Q310: null-overwrite-versus-coalesce.

## The problem in plain words

Two tables hold the same kind of record: a text key and an integer value. One is called `local`, one is called `remote`. They were the same once and have drifted apart. Reconciliation is the job of describing the drift and then, optionally, removing it.

Three questions cover the whole family. *Which keys exist only on one side?* That is a set-difference question, and the first two exercises ask it in both directions. *Which shared keys disagree?* That is a comparison question, and it is where NULL ruins everything. *Which side is authoritative?* That is a policy question, and it has no single answer: Q306 and Q308 say the remote snapshot wins, Q309 says the local row wins, and Q310 says the remote wins even when the remote value is NULL.

"Null-safe comparison" is the phrase the prompts use for the second question. In ordinary SQL, `NULL = NULL` is not true and `NULL <> 5` is not true either; both evaluate to NULL, which behaves as false in a `WHERE` clause. That is correct when NULL means "unknown", and wrong when NULL means "this record genuinely has no value", which is what it means here. SQLite gives you an operator for the second reading.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q301.txt`:

```sql
CREATE TABLE local(key TEXT PRIMARY KEY,value INTEGER);
CREATE TABLE remote(key TEXT PRIMARY KEY,value INTEGER);
INSERT INTO local VALUES('A',10),('B',20),('C',NULL),('D',4);
INSERT INTO remote VALUES('A',10),('B',25),('C',NULL),('E',5);
```

- Five keys appear across the two tables. `A` agrees (10 = 10). `B` disagrees (20 vs 25). `C` is NULL on both sides. `D` is local-only. `E` is remote-only. Every scenario is a different projection of those five facts.
- `key TEXT PRIMARY KEY` is a real unique index on a text column, not a rowid alias, so `ON CONFLICT(key)` in Q308 and Q309 has something to name.
- Column aliases are graded. Q303 must return `key, old_value, new_value`; Q305 returns `key, action`; Q307 returns `key, delta`; the rest return `key, value`.
- Every expected list is ordered by `key` ascending, so every final statement needs an explicit `ORDER BY`. The graders compare rows exactly and in order.
- Q304's expected rows are `A` and `C` — `C` is there **because** both sides are NULL. Any variant that uses `=` returns only `A`.
- Q305's expected actions, in key order, are `same, update, same, delete, insert`. `C` is `same`, again because NULL equals NULL under the null-safe operator.
- Q306 and Q308 both expect `B` to be 25 and `C` to be `null`. Q308 additionally drops `D`, because the mirror deletes local-only rows; Q306 keeps `D`, because it is a read-only union.
- Q307 expects two rows only, `A` with delta 0 and `B` with delta 5. `C` is excluded because arithmetic on NULL yields NULL, and the prompt asks for keys "with both values known".
- Q310's expected table is `A 10, B null, C null, D 4`: five keys minus `E`, which is never inserted, and `B` overwritten with the NULL the first statement wrote into `remote`.
- Nothing inspects the SQL text. But the tests compare the whole table in the four write scenarios, so a policy that touched a row it should have left alone is caught by the row it corrupted, not by the row it was about.

## Approach

1. **Pick the operator that matches the meaning of NULL in this data.** `IS` and `IS NOT` in SQLite are null-safe: they always return 0 or 1, never NULL. `NULL IS NULL` is 1; `NULL IS NOT 5` is 1; `1 IS NOT 2` is 1. Compare that with `NULL = NULL`, which is NULL. (Verified against SQLite 3.49.1: `SELECT (NULL IS NULL), (NULL = NULL)` returns `1, null`.) SQLite also accepts the SQL-standard spellings `IS DISTINCT FROM` and `IS NOT DISTINCT FROM` as synonyms of `IS NOT` and `IS`.
2. **Use `NOT EXISTS` for "missing on the other side".** A correlated `NOT EXISTS(SELECT 1 FROM other WHERE other.key = this.key)` asks only about key presence, so the NULL values never enter the test. `NOT IN (SELECT key FROM other)` would be a trap in general — a NULL in the subquery makes it match nothing — though it is safe here because `key` is `PRIMARY KEY` and therefore never NULL in SQLite's default (non-`WITHOUT ROWID`) tables.
3. **Build the key universe first when a scenario spans both sides.** `SELECT key FROM local UNION SELECT key FROM remote` gives the five keys once each; `UNION` (not `UNION ALL`) deduplicates.
4. **Then `LEFT JOIN` both tables back onto that universe.** After the join, `l.key IS NULL` means "not present locally" and `r.key IS NULL` means "not present remotely". Test the *key* column, never the value column: `r.value IS NULL` is also true for key `C`, which is present.
5. **Order the `CASE` branches by specificity.** Q305 asks first about absence, then about equality, and leaves `update` as the `ELSE`. Reversing the first two branches would classify `E` by comparing a value that does not exist.
6. **For "remote wins even when remote is NULL", branch on the key, not on the value.** `CASE WHEN r.key IS NOT NULL THEN r.value ELSE l.value END` keeps `C` at NULL. `COALESCE(r.value, l.value)` would silently fall back to the local value, which is the mistake Q310's title names.
7. **For a full mirror, do it in two statements inside one transaction.** An upsert brings every remote row in (insert or update), then a `DELETE … WHERE NOT EXISTS` removes what remote does not have. `BEGIN … COMMIT` makes the pair atomic.
8. **For append-only, change one word.** The same upsert with `DO NOTHING` instead of `DO UPDATE` preserves every local row and adds only the missing ones.

## Worked example — Q301 remote-only-inserts

The task, quoted from the prompt: "Find remote keys missing locally, return key,value."

**Step 1 — the two tables as seeded.**

| local.key | local.value | | remote.key | remote.value |
| --- | --- | --- | --- | --- |
| A | 10 | | A | 10 |
| B | 20 | | B | 25 |
| C | NULL | | C | NULL |
| D | 4 | | E | 5 |

**Step 2 — drive from `remote`.** The question is about remote keys, so `remote` is the outer table and `local` is the one being probed.

**Step 3 — evaluate `NOT EXISTS` once per remote row.**

| remote row | subquery `SELECT 1 FROM local l WHERE l.key = r.key` | `NOT EXISTS` | kept |
| --- | --- | --- | --- |
| A, 10 | returns one row | false | no |
| B, 25 | returns one row | false | no |
| C, NULL | returns one row | false | no |
| E, 5 | returns no rows | true | yes |

Note that `C` is rejected on key presence alone. Its NULL value is never compared, which is why this scenario needs no null-safe operator at all.

**Step 4 — order and project.** `ORDER BY r.key` over a single surviving row is trivial here, but it is the clause that makes the result deterministic when the answer has more than one row, and the grader compares order.

**Step 5 — the expected result**, asserted in `tests/Q301.cjs`:

```json
[{"key":"E","value":5}]
```

The reference solution, as it now reads in `solutions/Q301.sql`:

```sql
-- Why this works:
-- The question is about keys present remotely and absent locally, so remote
-- is the outer table and local is the one we probe.
-- NOT EXISTS runs a correlated subquery per remote row: it returns true when
-- that subquery finds nothing. Only the key is compared, so the NULL value
-- on key C never takes part in the test.
-- NOT IN (SELECT key FROM local) would also work on this seed because key is
-- a PRIMARY KEY and cannot be NULL, but NOT EXISTS is the form that stays
-- correct when the probed column is nullable.
-- ORDER BY r.key fixes the row order the grader compares.
SELECT r.key,
       r.value
FROM remote r
WHERE NOT EXISTS (SELECT 1 FROM local l WHERE l.key = r.key)
ORDER BY r.key;
```

**Q302 is the mirror image.** Swap the two table names and it answers "local keys absent remotely", yielding `D, 4`. Nothing else changes.

**Q303 and Q304 are the null-safe pair.** Both join the shared keys and differ only in the operator:

| | Q303 `WHERE l.value IS NOT r.value` | Q304 `WHERE l.value IS r.value` |
| --- | --- | --- |
| A (10 vs 10) | false — excluded | true — included |
| B (20 vs 25) | true — included | false — excluded |
| C (NULL vs NULL) | false — excluded | **true — included** |
| result | `B, 20, 25` | `A`, `C` |

Row `C` is the entire point. With `<>` in Q303 and `=` in Q304, the `C` comparison is NULL in both, so `C` would be excluded from *both* results, and Q304 would come back one row short.

## Policy matrix — what changes between the variants

| ID | Variant | The question it answers | What changes in the SQL |
| --- | --- | --- | --- |
| Q301 | remote-only-inserts | keys to add locally | `NOT EXISTS` probing `local`, driven from `remote` |
| Q302 | local-only-deletions | keys to remove locally | the same shape with the two table names swapped |
| Q303 | changed-shared-values-null-safe | keys that disagree | inner join on `key`, `WHERE l.value IS NOT r.value`, two value aliases |
| Q304 | unchanged-shared-including-null | keys that agree | the same join with `IS` instead of `IS NOT`, projecting `key` only |
| Q305 | change-classification | one label per key | `UNION` key list, two `LEFT JOIN`s, a four-branch `CASE` |
| Q306 | remote-authoritative-snapshot | the merged read-only view | the same scaffold, `CASE WHEN r.key IS NOT NULL THEN r.value ELSE l.value END` |
| Q307 | numeric-delta-known-shared | how far apart the numbers are | inner join, `r.value - l.value`, `WHERE … IS NOT NULL` on both sides |
| Q308 | apply-remote-full-mirror | make local identical to remote | `BEGIN`, upsert `DO UPDATE`, `DELETE … NOT EXISTS`, `COMMIT` |
| Q309 | append-only-do-not-overwrite | add without disturbing | the same upsert with `DO NOTHING` and no delete |
| Q310 | null-overwrite-versus-coalesce | let NULL win | an `UPDATE` of `remote` first, then a correlated `UPDATE` of `local` guarded by `EXISTS` |

## Pitfalls the tests are designed to catch

- **Using `=` or `<>` on the value columns.** Q304 expects `A` and `C`; `l.value = r.value` returns only `A`, one row short. Q305 expects `C` to be `same`; with `=` in the `CASE`, `C` falls through to `update`.
- **Testing `r.value IS NULL` instead of `r.key IS NULL`.** In Q305 and Q306 the join has already been made, and key `C` has a NULL *value* on both sides while being present on both. Branching on the value column classifies `C` as absent.
- **Reaching for `COALESCE` in Q306 or Q310.** `COALESCE(r.value, l.value)` gives key `C` the local value, which is also NULL here, so Q306 still passes by accident — but in Q310 the expected `B` is `null` after the remote value was set to NULL, and `COALESCE` would restore the local 20. Q310's title is a warning: "deliberately overwriting non-NULL with NULL rather than COALESCE".
- **Forgetting the `EXISTS` guard on Q310's `UPDATE`.** `UPDATE local SET value = (SELECT r.value FROM remote r WHERE r.key = local.key)` with no `WHERE` updates every local row, and a scalar subquery that matches nothing returns NULL — so `D` would become NULL instead of staying 4. The expected row is `D, 4`.
- **Including NULL rows in Q307's delta.** `r.value - l.value` for key `C` is `NULL - NULL`, which is NULL, and the row would appear with `"delta": null`. The expected list has exactly two rows; the `WHERE l.value IS NOT NULL AND r.value IS NOT NULL` filter is what removes `C`.
- **Omitting `WHERE true` before `ON CONFLICT` in Q308 and Q309.** After `INSERT INTO local SELECT * FROM remote`, SQLite's parser reads `ON` as the start of a join clause and reports `near "DO": syntax error`. Ending the source `SELECT` with a `WHERE` clause disambiguates it; `WHERE true` filters nothing.
- **Skipping the `DELETE` in Q308.** The mirror's expected rows are `A, B, C, E` — four rows. Without the delete, local-only `D` survives and the result has five.
- **Deleting before upserting in Q308 without a transaction.** Order matters less than atomicity here, but the prompt says "in a transaction", and `BEGIN … COMMIT` is what makes the intermediate state — local briefly missing rows — invisible to anything else.
- **Using `INSERT OR REPLACE` for Q309.** It deletes the conflicting row and re-inserts the remote one, so `B` would become 25 instead of staying 20. `DO NOTHING` is the policy the prompt asks for.
- **Selecting `l.*, r.*` after a `USING(key)` join.** `USING` merges the key column, but both tables still contribute a column literally named `value`. The runner turns each row into a JavaScript object, so the second `value` overwrites the first and one of them disappears silently. Q303 gives each side an explicit alias (`old_value`, `new_value`) for exactly this reason.
- **Dropping the `ORDER BY`.** Q305 and Q306 return five rows each and the grader compares them in order. SQLite's natural order for a `UNION`-driven query is not guaranteed by the language, and the expected lists are key-ascending.

## Try it yourself

1. Rewrite Q303 using `IS DISTINCT FROM` instead of `IS NOT` and confirm the result is unchanged. Which spelling would you prefer in a codebase shared with PostgreSQL developers?
2. Add `('F', NULL)` to `remote` in your head and say what Q305 and Q306 each return for key `F`.
3. Write a Q308 variant in which *local* is authoritative, and state which two lines of the reference swap.
4. In words: Q309's final table contains `E` and Q310's does not, even though both start from the same seed and both write to `local`. Explain why, naming the statement in each that decides it.

# UPSERT conflict targets and merge policy — sql-200 Q131–Q140

**What you practise:** `INSERT … ON CONFLICT`, the `excluded` pseudo-table, and the merge policies you can express with them — ignore, replace, accumulate, keep-max, keep-min and version-guarded.
**Prerequisites:** [13 SQLite schema constraints and integrity](13-sqlite-schema-constraints-and-integrity.md), because an upsert is built on a `UNIQUE` constraint; `UPDATE … SET`; scalar `MIN`/`MAX` as opposed to the aggregates of the same name.
**Exercises:** Q131: insert-new-key, Q132: existing-key-do-nothing, Q133: replace-quantity-only, Q134: accumulate-quantity, Q135: keep-maximum-quantity, Q136: accept-newer-version, Q137: reject-stale-version, Q138: minimum-price-and-version-increment, Q139: batch-insert-select-merge, Q140: composite-conflict-target.

## The problem in plain words

An inventory table holds one row per SKU. New data keeps arriving for SKUs that may or may not already be there. "Insert it if it is new, do something sensible if it is not" is such a common requirement that SQL has a dedicated form for it: **UPSERT**.

In SQLite it is written as an ordinary `INSERT` with an `ON CONFLICT` clause:

```sql
INSERT INTO inventory VALUES('A',3,99,9)
  ON CONFLICT(sku) DO UPDATE SET qty = excluded.qty;
```

Two parts matter. The **conflict target**, `(sku)`, names the unique index whose violation should trigger the clause instead of aborting the statement. The **action** is either `DO NOTHING` — discard the incoming row — or `DO UPDATE SET …`, which turns the failed insert into an update of the row that was already there.

Inside `DO UPDATE` you can see both rows. `inventory.qty` is the stored value; `excluded.qty` is the value the `INSERT` was trying to write. **`excluded`** is a pseudo-table, not a real one: it exists only inside the conflict clause and holds exactly the row that was excluded by the conflict. Every merge policy in this family is one expression over those two sides.

`DO UPDATE` may also carry its own `WHERE`. When it is false the update is simply skipped, with no error — which is what makes "reject stale writes" (Q137) a normal outcome rather than a failure.

## The contract you must honour

Eight of the ten exercises share this seed, quoted from `prompts/Q131.txt`:

```sql
CREATE TABLE inventory(sku TEXT PRIMARY KEY NOT NULL,qty INTEGER NOT NULL,price INTEGER NOT NULL,version INTEGER NOT NULL);
INSERT INTO inventory VALUES('A',5,10,2),('B',0,20,1);
```

Q139 adds a source table on top of it:

```sql
CREATE TABLE incoming(sku TEXT,qty INTEGER,price INTEGER,version INTEGER);
INSERT INTO incoming VALUES('A',6,11,3),('C',2,30,1);
```

Q140 gets the same seed but ignores `inventory` entirely and creates its own `counters` table.

- `sku TEXT PRIMARY KEY` is the unique index every `ON CONFLICT(sku)` refers to. It is a real indexed column, not a rowid alias, because its type is `TEXT`.
- Row A starts at `qty 5, price 10, version 2`; row B at `qty 0, price 20, version 1`. B's zero quantity is what makes the keep-max policy visible in Q135.
- Nine of the ten exercises end with `SELECT sku,qty,price,version FROM inventory ORDER BY sku;` and are graded on the whole table, so a policy that touches a column it should not have touched shows up immediately. Q140 ends with `SELECT bucket,name,value FROM counters ORDER BY bucket,name;`.
- Expected row counts: 3 rows for Q131 (A, B and the new C) and Q139 (A, B, C); 2 rows for Q132–Q138 and Q140.
- The asserted values pin each policy: Q133 gives `A qty 3, price 10, version 2` — only `qty` moved. Q134 gives `A qty 8` — 5 + 3. Q135 gives `A qty 5` and `B qty 4` — each the larger of stored and incoming. Q136 gives `A 7,12,3`; Q137, with the same statement text and a stale incoming version, gives `A 5,10,2`. Q138 gives `A qty 5, price 8, version 3` — the cheaper price kept, the stored version incremented rather than adopted.
- Q140 expects `{"bucket":"day","name":"hits","value":5}` and `{"bucket":"week","name":"hits","value":8}`: only the `day/hits` pair was merged.
- Nothing in these tests inspects the SQL text, but a wholesale `INSERT OR REPLACE` that happens to produce the right rows for one variant will produce wrong rows for its siblings, because it never preserves a column.

## Approach

1. **Name the conflict target that matches the unique index.** `ON CONFLICT(sku)` for a single-column key; `ON CONFLICT(bucket,name)` for a composite one. The columns must together be a unique index or SQLite raises "ON CONFLICT clause does not match any PRIMARY KEY or UNIQUE constraint".
2. **Choose the action from the policy.** "Leave what is there" is `DO NOTHING`. Anything that computes a new value is `DO UPDATE`.
3. **List in `SET` only the columns that should change.** Every column you omit keeps its stored value. That is the whole of Q133 and half of Q138.
4. **Qualify both sides when the new value depends on the old one.** `inventory.qty + excluded.qty` accumulates; a bare `qty` on the right-hand side would mean the stored value and turn the policy into something else.
5. **Use scalar `MAX`/`MIN` for keep-larger and keep-smaller.** With two or more arguments these are scalar functions, unrelated to the aggregates; `MAX(inventory.qty, excluded.qty)` is a per-row comparison.
6. **Guard a conditional merge with `WHERE` inside `DO UPDATE`.** `WHERE excluded.version > inventory.version` applies the write only when it is newer. A false guard skips the update silently.
7. **Compute rather than copy when the column is bookkeeping.** `version = inventory.version + 1` counts changes; `version = excluded.version` trusts the caller.
8. **For a bulk merge, make the source a `SELECT` and end it with `WHERE true`.** SQLite's parser cannot otherwise tell whether `ON` begins a join or the conflict clause, so the `SELECT` must end in a `WHERE` clause.

## Worked example — Q131 insert-new-key

The task, quoted from the prompt: "Insert missing SKU C=(qty 3,price 30,version 1) with ON CONFLICT DO NOTHING; return all inventory ordered by sku."

**Statement 1 — the upsert.**

Before:

| sku | qty | price | version |
| --- | --- | --- | --- |
| A | 5 | 10 | 2 |
| B | 0 | 20 | 1 |

The incoming row is `('C',3,30,1)`. SQLite checks the `sku` primary-key index for `'C'` and finds nothing, so **no conflict occurs** and the `ON CONFLICT` clause is never reached. The row is inserted the ordinary way.

After:

| sku | qty | price | version |
| --- | --- | --- | --- |
| A | 5 | 10 | 2 |
| B | 0 | 20 | 1 |
| C | 3 | 30 | 1 |

**Statement 2 — `SELECT sku,qty,price,version FROM inventory ORDER BY sku;`** — the graded statement, returning the three rows above in that order, which is what `tests/Q131.cjs` asserts.

The reference solution, as it now reads in `solutions/Q131.sql`:

```sql
-- Why this works:
-- ON CONFLICT(sku) names the conflict target: the unique index the INSERT
-- must watch. SKU 'C' is absent, so no conflict happens and the row is
-- inserted normally.
-- DO NOTHING is therefore never reached; it is the policy for the case that
-- does not occur here, and Q132 is the same statement on a key that does
-- collide.
-- The following SELECT is the graded statement and reports the whole table.
INSERT INTO inventory VALUES('C', 3, 30, 1)
  ON CONFLICT(sku) DO NOTHING;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;
```

**The Q132 mirror.** Change the incoming row to `('A',99,99,99)` and the same statement takes the other branch: the index already holds `'A'`, the conflict fires, `DO NOTHING` discards the incoming row, and the table is unchanged. Remove the `ON CONFLICT` clause altogether and the statement aborts with `UNIQUE constraint failed: inventory.sku`, which the grader reports as a failure rather than a result.

**The Q136/Q137 pair, traced.** Both run:

```sql
INSERT INTO inventory VALUES('A', <qty>, <price>, <version>)
  ON CONFLICT(sku) DO UPDATE
    SET qty = excluded.qty, price = excluded.price, version = excluded.version
    WHERE excluded.version > inventory.version;
```

| Step | Q136 (incoming version 3) | Q137 (incoming version 1) |
| --- | --- | --- |
| conflict on `'A'` | yes | yes |
| `excluded.version > inventory.version` | 3 > 2 → true | 1 > 2 → false |
| `SET` applied | yes | no |
| resulting row A | 7, 12, 3 | 5, 10, 2 |
| statement outcome | success | success — a false guard is not an error |

## Policy matrix — what changes between the variants

| ID | Variant | Incoming row | What changes in the SQL |
| --- | --- | --- | --- |
| Q131 | insert-new-key | `('C',3,30,1)` | `DO NOTHING`; the key is absent so the clause never fires |
| Q132 | existing-key-do-nothing | `('A',99,99,99)` | the same `DO NOTHING`, this time on a colliding key |
| Q133 | replace-quantity-only | `('A',3,99,9)` | `DO UPDATE SET qty=excluded.qty` — one column only |
| Q134 | accumulate-quantity | `('A',3,99,9)` | `SET qty=inventory.qty+excluded.qty` |
| Q135 | keep-maximum-quantity | `('A',3,…),('B',4,…)` | `SET qty=MAX(inventory.qty,excluded.qty)`, applied per conflicting row |
| Q136 | accept-newer-version | `('A',7,12,3)` | all three columns adopted, under `WHERE excluded.version>inventory.version` |
| Q137 | reject-stale-version | `('A',7,12,1)` | identical SQL; only the data makes the guard false |
| Q138 | minimum-price-and-version-increment | `('A',100,8,50)` | `SET price=MIN(…), version=inventory.version+1`; `qty` omitted |
| Q139 | batch-insert-select-merge | the `incoming` table | source is `SELECT … FROM incoming WHERE true` |
| Q140 | composite-conflict-target | `('day','hits',3)` | `ON CONFLICT(bucket,name)` over a two-column primary key |

## Pitfalls the tests are designed to catch

- **Omitting the conflict target.** SQLite 3.49.1 accepts `ON CONFLICT DO UPDATE` with no target and applies it to whichever constraint was violated. That is tolerable with one unique index and a trap with several, so the references always name the target — and a composite key has to be named anyway.
- **Naming a non-unique column as the target.** In Q140, `ON CONFLICT(name)` fails with "does not match any PRIMARY KEY or UNIQUE constraint", because `'hits'` appears under two buckets.
- **Reaching for `INSERT OR REPLACE`.** It deletes the conflicting row and inserts the new one, so Q133 would end with `A qty 3, price 99, version 9` instead of preserving `price 10, version 2`. It also fires `ON DELETE CASCADE` on child rows, which surprises people at exactly the wrong moment.
- **Writing `SET qty = qty + excluded.qty`.** Inside `DO UPDATE` an unqualified column means the stored row, so this is the same as `inventory.qty + excluded.qty` — correct here, but ambiguous to read. The reference qualifies both sides; Q133's `SET qty = excluded.qty` is the case where getting it wrong silently does nothing.
- **Confusing scalar `MAX` with the aggregate.** `MAX(inventory.qty, excluded.qty)` takes two arguments and compares them. `MAX(qty)` with one argument in this position is an aggregate and is not allowed in a `SET` expression.
- **Putting the version guard in the wrong place.** A `WHERE` before `ON CONFLICT` filters the rows to insert; the guard belongs *after* the `SET` list, inside `DO UPDATE`. Q137 depends on the statement still succeeding when the guard is false.
- **Adopting the incoming version in Q138.** The expected version is 3, which is the stored 2 plus one, not the incoming 50.
- **Updating `qty` in Q138.** The incoming quantity is 100; the expected row keeps 5. `qty` must not appear in the `SET` list.
- **Forgetting `WHERE true` in Q139.** Without it SQLite reports `near "DO": syntax error`, because after a `SELECT … FROM …` the parser reads `ON` as the start of a join condition. Ending the `SELECT` in a `WHERE` clause resolves it. `WHERE true` keeps every source row; it is a parser disambiguator, not a filter.
- **Expecting `excluded` to exist outside the conflict clause.** It is only in scope inside `DO UPDATE`; referring to it in the `SELECT` afterwards is an error.
- **Selecting only the columns a variant changed.** Every test asserts all four inventory columns, so a policy that quietly rewrote `price` is caught even when the exercise is about `qty`.

## Try it yourself

1. Rewrite Q134 so that the accumulated quantity is capped at 6, using one expression in the `SET` clause. What does row A become?
2. Q135's incoming batch conflicts on both rows. Add a third incoming row for a SKU that does not exist and predict the row count before running it.
3. Write a "newer *or equal* wins" variant of Q136 and say which of Q136 and Q137 changes its answer.
4. In words: Q132 and Q137 both leave the table unchanged, but for different reasons. Describe each, and say how a caller could tell the two apart if it could see how many rows the statement changed.

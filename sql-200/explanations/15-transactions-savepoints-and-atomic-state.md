# Transactions savepoints and atomic state — sql-200 Q141–Q150

**What you practise:** grouping writes into one atomic unit with `BEGIN`/`COMMIT`/`ROLLBACK`, and rewinding part of that unit with `SAVEPOINT`, `ROLLBACK TO` and `RELEASE`.
**Prerequisites:** [13 SQLite schema constraints and integrity](13-sqlite-schema-constraints-and-integrity.md) for the `CHECK` constraint these accounts carry; `UPDATE … SET col = col ± n`; the idea that a statement outside a transaction commits on its own.
**Exercises:** Q141: commit-balanced-transfer, Q142: rollback-transfer, Q143: savepoint-discard-inner-changes, Q144: release-savepoint-then-outer-rollback, Q145: savepoint-as-outer-transaction, Q146: transactional-ddl-rollback, Q147: commit-data-and-audit, Q148: rollback-audit-with-transfer, Q149: nested-savepoint-preserve-middle, Q150: immediate-transaction-commit.

## The problem in plain words

Two bank accounts and an audit log. Every exercise moves money, and the question is always the same: what is actually stored when the dust settles?

A **transaction** is a group of statements that succeed or fail together. `BEGIN` opens one, `COMMIT` makes everything since `BEGIN` permanent, and `ROLLBACK` discards all of it. Without an explicit `BEGIN`, SQLite wraps each statement in its own transaction and commits it immediately, so a half-finished transfer would be visible to the next reader.

A **savepoint** is a named marker *inside* a transaction. `SAVEPOINT a` sets it, `ROLLBACK TO a` undoes everything done since it while leaving the transaction open, and `RELEASE a` discards the marker, folding its work into whatever encloses it. Savepoints nest, so they give you partial undo where `ROLLBACK` is all-or-nothing.

The one rule that catches everybody is that **`RELEASE` is not `COMMIT`**. Releasing a savepoint that sits inside an explicit `BEGIN` merges its changes into that outer transaction and nothing more; if the outer transaction later rolls back, the released work goes with it (Q144). But a `SAVEPOINT` issued when no transaction is open *starts* one, and releasing that outermost savepoint really does commit (Q145). Two exercises, same keyword, opposite outcomes.

These scenarios run on a single connection against a fresh in-memory database. They verify committed state, not what a competing writer would see; the GUIDE says so explicitly, and Q150 is where it matters.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q141.txt`:

```sql
CREATE TABLE accounts(id INTEGER PRIMARY KEY,balance INTEGER NOT NULL CHECK(balance>=0));
INSERT INTO accounts VALUES(1,100),(2,50);
CREATE TABLE audit(id INTEGER PRIMARY KEY,note TEXT);
```

- Account 1 starts at 100, account 2 at 50; the total is 150 and every committed transfer in this family preserves it.
- `CHECK(balance>=0)` is enforced on every `UPDATE`, so a transfer larger than the source balance would fail the statement rather than committing a negative number. All the amounts here stay well inside that limit.
- `audit` starts empty and `audit.id` is `INTEGER PRIMARY KEY`, so inserts name only `(note)`.
- Aliases: `id, balance` for Q141–Q145 and Q149–Q150; `tables_found` for Q146; `id, balance, audit_count` for Q147 and Q148.
- Row counts: 2 rows everywhere except Q146, which returns a single row.
- The asserted balances are the whole point, so they are worth reading as a set: Q141 `80/70`; Q142 `100/50`; Q143 `90/50`; Q144 `100/50`; Q145 `105/55`; Q147 `90/60` with `audit_count` 1; Q148 `100/50` with `audit_count` 0; Q149 `103/50`; Q150 `85/65`.
- Q146 expects `{"tables_found":0}` from `sqlite_schema`, not an error. Querying the rolled-back table directly would raise `no such table: temporary_work`, which the grader records as a failure, not as a result.
- Q147 and Q148 report `audit_count` next to each account row, so the count appears twice — once per account — with the same value.

## Approach

1. **Wrap related writes in `BEGIN … COMMIT`** whenever the intermediate state would be wrong if someone read it. A transfer is two `UPDATE`s and the money does not exist in between.
2. **Decide the ending before you write the body.** `COMMIT` keeps everything since `BEGIN`; `ROLLBACK` keeps nothing. The statements in between are identical either way, which is exactly what the Q141/Q142 and Q147/Q148 pairs demonstrate.
3. **Use a savepoint for work that might be abandoned** while the surrounding transaction continues. Set it *after* the work you intend to keep.
4. **Pair `ROLLBACK TO` with `RELEASE`.** `ROLLBACK TO a` rewinds but leaves `a` in place, so the savepoint is still open; `RELEASE a` is what finishes with it.
5. **Check what encloses a savepoint before assuming `RELEASE` commits.** Inside a `BEGIN`, it commits nothing. Outside one, the savepoint *is* the transaction and `RELEASE` commits it.
6. **Put an audit write inside the same transaction as the change it describes**, so the two cannot get out of step.
7. **Remember that DDL is transactional in SQLite.** `CREATE TABLE` writes to `sqlite_schema` like any other change and is undone by `ROLLBACK`.
8. **Query `sqlite_schema` when you need to ask whether an object exists**, rather than querying the object and hoping.
9. **Reach for `BEGIN IMMEDIATE` when the transaction will certainly write.** It takes the write lock up front instead of on the first write, which avoids a failed lock upgrade later. On this single connection it changes nothing observable.

## Worked example — Q141 commit-balanced-transfer

The task, quoted from the prompt: "In one explicit transaction transfer 20 from account 1 to 2 and commit. Return all balances ordered by id."

**Statement 1 — `BEGIN;`** opens a transaction. Nothing is written yet; SQLite simply stops autocommitting.

| id | balance | committed? |
| --- | --- | --- |
| 1 | 100 | yes |
| 2 | 50 | yes |

**Statement 2 — `UPDATE accounts SET balance = balance - 20 WHERE id = 1;`** The row is changed inside the transaction. `CHECK(balance>=0)` is evaluated now, on 80, and passes.

| id | balance | visible to this connection | durable |
| --- | --- | --- | --- |
| 1 | 80 | yes | no |
| 2 | 50 | yes | yes |

This is the state that must never be observable as a final answer: 150 has become 130.

**Statement 3 — `UPDATE accounts SET balance = balance + 20 WHERE id = 2;`**

| id | balance |
| --- | --- |
| 1 | 80 |
| 2 | 70 |

The total is 150 again.

**Statement 4 — `COMMIT;`** Both changes become permanent together.

**Statement 5 — `SELECT id, balance FROM accounts ORDER BY id;`** — the graded statement, run outside any transaction, returning `[{"id":1,"balance":80},{"id":2,"balance":70}]`, which is what `tests/Q141.cjs` asserts.

The reference solution, as it now reads in `solutions/Q141.sql`:

```sql
-- Why this works:
-- BEGIN opens an explicit transaction, so the two UPDATEs are one unit of
-- work; COMMIT makes both permanent at the same instant.
-- The two amounts match, which is what keeps the total at 150 and keeps the
-- CHECK(balance>=0) constraint satisfied at every step.
-- Without BEGIN each statement would autocommit on its own, and a failure
-- between them would leave money missing.
-- The trailing SELECT runs outside the transaction and reports the
-- committed state.
BEGIN;
UPDATE accounts SET balance = balance - 20 WHERE id = 1;
UPDATE accounts SET balance = balance + 20 WHERE id = 2;
COMMIT;
SELECT id, balance
FROM accounts
ORDER BY id;
```

Q142 is the same five statements with `ROLLBACK` in place of `COMMIT`, and the answer returns to `100/50`. Both `UPDATE`s really ran — a statement inside the transaction would have seen 80 — but nothing was kept.

**Q149 traced, because nesting is where the rules bite.** Account 1 only:

| Statement | balance | savepoints open |
| --- | --- | --- |
| `BEGIN` | 100 | — |
| `UPDATE … +1` | 101 | — |
| `SAVEPOINT a` | 101 | a |
| `UPDATE … +2` | 103 | a |
| `SAVEPOINT b` | 103 | a, b |
| `UPDATE … +4` | 107 | a, b |
| `ROLLBACK TO b` | 103 | a, b (b survives the rewind) |
| `RELEASE b` | 103 | a |
| `RELEASE a` | 103 | — (still inside `BEGIN`) |
| `COMMIT` | 103 | committed |

The asserted balance is 103: the `+1` and `+2` survive and the `+4` does not.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q141 | commit-balanced-transfer | "transfer 20 and commit" | `BEGIN` … two `UPDATE`s … `COMMIT` |
| Q142 | rollback-transfer | "but ROLLBACK it" | the same body, ended with `ROLLBACK` |
| Q143 | savepoint-discard-inner-changes | "roll back to optional and release it" | a `SAVEPOINT` after the first update, then `ROLLBACK TO` + `RELEASE` + `COMMIT` |
| Q144 | release-savepoint-then-outer-rollback | "RELEASE is not an outer COMMIT" | `RELEASE` the savepoint, then `ROLLBACK` the enclosing transaction |
| Q145 | savepoint-as-outer-transaction | "without BEGIN" | `SAVEPOINT` with nothing enclosing it; `RELEASE` commits |
| Q146 | transactional-ddl-rollback | "DDL is transactional here" | `CREATE TABLE` inside `BEGIN`, then `ROLLBACK`; the final `SELECT` counts `sqlite_schema` rows |
| Q147 | commit-data-and-audit | "atomically transfer and insert audit note" | an `INSERT INTO audit` joins the transaction; the `SELECT` adds a scalar subquery |
| Q148 | rollback-audit-with-transfer | "roll back both" | identical body, ended with `ROLLBACK`; `audit_count` becomes 0 |
| Q149 | nested-savepoint-preserve-middle | "savepoint a, savepoint b, rollback to b" | two nested savepoints; only the post-`b` work is discarded |
| Q150 | immediate-transaction-commit | "use BEGIN IMMEDIATE" | `BEGIN IMMEDIATE` instead of `BEGIN`; everything else as Q141 |

## Pitfalls the tests are designed to catch

- **Leaving the transaction open.** A submission that ends `BEGIN; UPDATE …; SELECT …` with no `COMMIT` returns the uncommitted values, and in this family the expected values are the committed ones. The database is discarded afterwards, so nothing warns you.
- **Expecting `RELEASE` to commit in Q144.** The released `+30` is undone by the outer `ROLLBACK`; the expected balances are the untouched `100/50`. Q145 is the contrast: there the savepoint is the outermost transaction and `RELEASE` does commit.
- **Omitting `RELEASE` after `ROLLBACK TO` in Q143 and Q149.** `ROLLBACK TO` leaves the savepoint open, so the transaction still has an unfinished marker when `COMMIT` runs. SQLite tolerates that — `COMMIT` closes everything — but the intent is clearer, and portable, when each savepoint is released.
- **Rolling back to the wrong savepoint in Q149.** `ROLLBACK TO a` would discard the `+2` as well and give 101 rather than the expected 103.
- **Putting the savepoint before the work you mean to keep in Q143.** The `-10` must happen before `SAVEPOINT optional`; set the savepoint first and the rollback takes the `-10` with it.
- **Using `ROLLBACK` where `ROLLBACK TO` is meant.** Plain `ROLLBACK` abandons the whole transaction, not just the savepoint, and Q143 would return `100/50`.
- **Querying the rolled-back table in Q146.** `SELECT COUNT(*) FROM temporary_work` raises `no such table`, and the runner records that as a grading failure with phase `execute`. The expected answer comes from `sqlite_schema`.
- **Assuming DDL survives a rollback.** It does in several other engines. In SQLite the schema lives in a table, so `CREATE TABLE` is rolled back like any other write — that is what Q146 asserts.
- **Splitting the audit write out of the transaction in Q148.** An `INSERT INTO audit` placed after `ROLLBACK` would run in its own autocommit transaction and survive, giving `audit_count` 1 where 0 is expected.
- **Supplying `audit.id` explicitly.** Harmless here, but the prompt's shape is `INSERT INTO audit(note) VALUES('transfer:10')`; the rowid alias assigns the id.
- **Reading `BEGIN IMMEDIATE` as a durability or isolation guarantee.** It changes when the write lock is taken, nothing else. With one connection and no competing writer, Q150 and Q141 differ only in that keyword, and the GUIDE says these scenarios do not test concurrency.
- **Unbalancing the transfer.** The two `UPDATE`s must use the same amount; `-20`/`+15` commits happily and silently changes the total, and the expected rows catch it.

## Try it yourself

1. Change Q141's transfer to 200 and predict what happens: which statement fails, what does the grader report, and what is the committed state afterwards?
2. Add a second `SAVEPOINT c` after the `+4` in Q149 and roll back to `c` instead of `b`. What balance results, and what does that tell you about where a savepoint should be set?
3. Rewrite Q145 so that the batch is abandoned instead of kept, without using `BEGIN`. Which keyword replaces `RELEASE`?
4. In words: Q144 and Q145 both end with `RELEASE`, and only one of them keeps its work. State the rule in one sentence, then say how you would check which case you are in before writing the `RELEASE`.

# Financial ledgers balancing and allocation — sql-more Q311–Q320

**What you practise:** double-entry bookkeeping expressed as `GROUP BY` and `HAVING`, and splitting an integer amount across recipients without ever producing a fraction of a cent.
**Prerequisites:** [sql-200 03 GROUP BY HAVING and aggregate policy](../../sql-200/explanations/03-group-by-having-and-aggregate-policy.md); [sql-200 05 Ranking and top N per group](../../sql-200/explanations/05-ranking-and-top-n-per-group.md) for `ROW_NUMBER`; [sql-200 07 CTE pipelines](../../sql-200/explanations/07-cte-pipelines-and-recursive-traversal.md).
**Exercises:** Q311: balanced-transactions, Q312: unbalanced-transactions, Q313: account-debit-normal-balances, Q314: posted-only-balanced-ledger, Q315: trial-balance-control, Q316: reversal-swap-sides, Q317: cash-flow-by-transaction, Q318: integer-cents-remainder-allocation, Q319: weighted-largest-remainder, Q320: repair-discrepancy-with-suspense.

## The problem in plain words

A **ledger** in double-entry bookkeeping is a table of lines. Each line belongs to a transaction, names an account, and carries an amount on one of two sides: **debit** or **credit**. The rule the whole system rests on is that within a transaction the debits and the credits must add up to the same number. A transaction that satisfies it is *balanced*; one that does not is *unbalanced*, and in a real system it would not be allowed to post.

That rule turns into a `GROUP BY tx` with a `HAVING` clause, and the first five exercises are variations on which side of that clause you stand. Q311 keeps the balanced transactions, Q312 keeps the unbalanced ones, Q314 uses balance as a filter before computing something else, and Q315 collapses the entire ledger to a single control row.

The second half is about **allocation**: you have a whole number of cents and several recipients, and you must hand out every cent. Divide 100 by 3 and arithmetic gives you 33.333…; a ledger cannot hold a third of a cent. The fix in both allocation exercises is to divide with integer division, then distribute the leftover units one at a time under a stated, deterministic rule. Q318 uses "lowest id first", Q319 uses "largest remainder first, ties by id".

Nothing here is accounting advice. The GUIDE says so explicitly: these are integer arithmetic exercises using the vocabulary of ledgers.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q311.txt`:

```sql
CREATE TABLE ledger(tx INTEGER,line INTEGER,account TEXT,debit INTEGER,credit INTEGER,PRIMARY KEY(tx,line));
INSERT INTO ledger VALUES(1,1,'cash',100,0),(1,2,'income',0,100),
                         (2,1,'expense',30,0),(2,2,'cash',0,30),
                         (3,1,'cash',20,0),(3,2,'income',0,15);
```

- `PRIMARY KEY(tx,line)` is a composite key, so the pair must be unique. Q316 inserts lines under a new `tx = 4` and Q320 inserts `(3,3)`; both avoid the existing pairs.
- Three transactions. Transaction 1 balances at 100, transaction 2 balances at 30, transaction 3 has debits 20 and credits 15 — a discrepancy of 5. That one broken transaction is what every "balanced only" and "repair" scenario is about.
- Amounts are stored as `INTEGER`, never as a floating point number, and every arithmetic result the tests expect is an integer. Q318 expects `34, 33, 33`; Q319 expects `2, 3, 5`.
- Aliases are graded. Q311 returns `tx, amount`; Q312 and Q320 return `tx, discrepancy`; Q313, Q314 and Q316 return `account, balance`; Q315 returns `debits, credits, discrepancy`; Q317 returns `tx, inflow, outflow, net`; Q318 and Q319 return `id, cents`.
- Every multi-row expectation is in ascending order of its first column, so an `ORDER BY` is required. Q315 returns exactly one row and therefore needs none.
- Q313's expected `income` balance is `-115`. The sign is the policy: this family uses the *debit-normal* convention, where `debit - credit` is the balance, so accounts that mostly receive credits come out negative. Nothing is wrong with a negative balance here.
- Q314's expected balances are `cash 70`, `expense 30`, `income -100` — transaction 3 is excluded whole, both of its lines, not just the line that fails to match.
- Q316's expected `expense` balance is `0`, because the reversal cancels transaction 2 exactly; `income` stays at `-115`, because the still-unbalanced transaction 3 is not touched.
- Q317's expected rows include `tx 2` with `inflow 0`, so the query must produce a zero, not a NULL and not a missing row.
- Q320's expectation is three rows all reading `"discrepancy": 0`. The inserted suspense line makes transaction 3 balance; the assertion is that *every* transaction now balances.

## Approach

1. **Group by the unit the rule applies to.** The balance rule is per transaction, so `GROUP BY tx`. The reporting question in Q313 is per account, so `GROUP BY account`. Q315 has no `GROUP BY` at all: an aggregate with no grouping collapses the whole table to one row.
2. **Put the balance test in `HAVING`, not `WHERE`.** `WHERE` filters individual lines before grouping and cannot see a sum; `HAVING` filters groups after aggregation. `HAVING SUM(debit)=SUM(credit)` and `HAVING SUM(debit-credit)<>0` are the two halves of this family.
3. **Prefer `SUM(debit - credit)` to `SUM(debit) - SUM(credit)` when you want a signed net.** They agree here because no amount is NULL. They diverge when a column can be NULL: `SUM` skips NULLs, while `debit - credit` is NULL for the whole line if either side is.
4. **Quarantine a transaction, not a line.** Q314 needs the set of balanced `tx` values first — a CTE — and then restricts the ledger to that set before aggregating by account. Filtering lines individually would keep half of transaction 3.
5. **Express a reversal as a projection that swaps two columns.** `SELECT 4, line, account, credit, debit FROM ledger WHERE tx = 2` copies the lines with the two amount columns exchanged, so every `debit - credit` term flips sign and the pair sums to zero.
6. **Use integer division and the remainder operator for allocation.** In SQLite `/` between two integers is integer division and `%` is the remainder: `SELECT 100/3, 100%3` returns `33, 1` (checked against SQLite 3.49.1). Writing `100.0/3` would switch to floating point and return `33.333333333333336`, which is exactly what a currency calculation must avoid.
7. **Distribute the remainder with a rank, not a loop.** Give every recipient a priority with `ROW_NUMBER() OVER (ORDER BY …)` and add one unit to the first *r* of them, where *r* is the number of units still unallocated. `SUM(x) OVER ()` — a window with an empty `OVER` clause — computes the total over all rows while keeping every row, which is how Q319 learns how many units the floors already used.
8. **Balance a broken transaction by inserting the difference on the opposite side.** Transaction 3 is 5 in debit surplus, so a credit line of 5 to a `suspense` account brings its net to zero. This is the standard real-world move: park the unexplained amount somewhere visible rather than adjusting a real account.

## Worked example — Q311 balanced-transactions

The task, quoted from the prompt: "Find transactions where total debit equals total credit; return tx and debit total."

**Step 1 — the six ledger lines.**

| tx | line | account | debit | credit |
| --- | --- | --- | --- | --- |
| 1 | 1 | cash | 100 | 0 |
| 1 | 2 | income | 0 | 100 |
| 2 | 1 | expense | 30 | 0 |
| 2 | 2 | cash | 0 | 30 |
| 3 | 1 | cash | 20 | 0 |
| 3 | 2 | income | 0 | 15 |

**Step 2 — `GROUP BY tx` forms three groups**, and the two aggregates are computed inside each:

| group | `SUM(debit)` | `SUM(credit)` | equal? |
| --- | --- | --- | --- |
| tx 1 | 100 | 100 | yes |
| tx 2 | 30 | 30 | yes |
| tx 3 | 20 | 15 | no |

**Step 3 — `HAVING SUM(debit) = SUM(credit)` drops the third group.** This test cannot be written in `WHERE`: at the time `WHERE` runs, there is no group to sum, only individual lines, and no single line of transaction 1 has equal debit and credit.

**Step 4 — project `SUM(debit) AS amount`.** For a balanced transaction the debit total and the credit total are the same number, so either would do; the prompt asks for the debit total.

**Step 5 — `ORDER BY tx`** fixes the comparison order. The expected result, asserted in `tests/Q311.cjs`:

```json
[{"tx":1,"amount":100},{"tx":2,"amount":30}]
```

The reference solution, as it now reads in `solutions/Q311.sql`:

```sql
-- Why this works:
-- The balance rule applies per transaction, so GROUP BY tx forms one group
-- per transaction and the two aggregates run inside each group.
-- The test belongs in HAVING, not WHERE: WHERE filters individual lines
-- before any grouping happens and cannot see a SUM.
-- Transaction 3 has debits 20 and credits 15, so its group is dropped and
-- only transactions 1 and 2 remain.
-- For a balanced transaction the debit total equals the credit total, so
-- SUM(debit) is the amount the prompt asks for.
SELECT tx,
       SUM(debit) AS amount
FROM ledger
GROUP BY tx
HAVING SUM(debit) = SUM(credit)
ORDER BY tx;
```

**Q312 is the complement**, written with the other formulation: `SUM(debit-credit) <> 0` keeps exactly the groups `SUM(debit)=SUM(credit)` rejects, and returns the signed size of the imbalance. On this seed the two queries partition the three transactions into `{1,2}` and `{3}`.

**Q318 traced, because the arithmetic is the exercise.** Amount 100, three recipients.

| step | expression | value |
| --- | --- | --- |
| equal share | `100/3` (integer division) | 33 |
| units left over | `100%3` | 1 |
| recipient 1 | `33 + (1 <= 1 ? 1 : 0)` | 34 |
| recipient 2 | `33 + (2 <= 1 ? 1 : 0)` | 33 |
| recipient 3 | `33 + (3 <= 1 ? 1 : 0)` | 33 |
| total | | 100 |

The condition `id <= 100%3` is the whole distribution rule: the remainder is 1, so only `id = 1` qualifies. Had the amount been 101, the remainder would be 2 and ids 1 and 2 would each gain a cent. The total is exactly the original amount by construction, which is the property an allocation must have.

## Policy matrix — what changes between the variants

| ID | Variant | The question it answers | What changes in the SQL |
| --- | --- | --- | --- |
| Q311 | balanced-transactions | which transactions obey the rule | `GROUP BY tx HAVING SUM(debit)=SUM(credit)` |
| Q312 | unbalanced-transactions | which break it, and by how much | the same shape with `HAVING SUM(debit-credit)<>0` and a signed projection |
| Q313 | account-debit-normal-balances | what each account is worth | `GROUP BY account`, no `HAVING` |
| Q314 | posted-only-balanced-ledger | balances ignoring bad data | a CTE of balanced `tx`, then `WHERE tx IN (…)` before `GROUP BY account` |
| Q315 | trial-balance-control | one control row for the ledger | no `GROUP BY`; three aggregates over the whole table |
| Q316 | reversal-swap-sides | cancelling a posted transaction | an `INSERT … SELECT` that swaps the `debit` and `credit` columns |
| Q317 | cash-flow-by-transaction | cash movement per transaction | `WHERE account='cash'` before `GROUP BY tx`, three aggregates |
| Q318 | integer-cents-remainder-allocation | equal split of 100 cents | a `VALUES` CTE, `100/3` plus a `CASE` on `id <= 100%3` |
| Q319 | weighted-largest-remainder | proportional split of 10 cents | floors and remainders per weight, `ROW_NUMBER` priority, `SUM(...) OVER ()` |
| Q320 | repair-discrepancy-with-suspense | making a broken transaction balance | an `INSERT` of the difference as a credit, then Q312's aggregate without its `HAVING` |

## Pitfalls the tests are designed to catch

- **Putting the balance test in `WHERE`.** `WHERE SUM(debit)=SUM(credit)` is rejected by SQLite 3.49.1 with `misuse of aggregate: SUM()`. The grader reports that as a failure, not as a result.
- **Filtering lines instead of transactions in Q314.** A `WHERE debit = credit` style filter, or excluding only the short line of transaction 3, leaves `cash` at 90 instead of the expected 70. The CTE must select whole `tx` values.
- **Using floating point for the allocation.** `100.0/3` returns `33.333333333333336`, and `ROUND` of three such values gives 33, 33, 33 — 99 cents distributed out of 100. The expected first row is `34`. Money exercises in this pack are integer-only, as the GUIDE states.
- **Dropping the remainder entirely.** `SELECT id, 100/3 AS cents` returns 33, 33, 33 and loses a cent. Every allocation needs the leftover clause.
- **Reversing the tie-break in Q319.** The priority is `ORDER BY remainder DESC, id` — largest remainder first, then lowest id. With `ORDER BY remainder, id` the extra cent lands on id 3 instead, and the result is `1, 3, 6` rather than the expected `2, 3, 5` (run both and compare).
- **Hard-coding how many units are left in Q319.** `SUM(floor_cents) OVER ()` computes 9 from the data, so the leftover is `10 - 9 = 1`. An empty `OVER ()` window spans every row of the result and does not collapse them, which a plain `SUM(floor_cents)` would.
- **Writing the reversal in Q316 as an `UPDATE`.** Reversing a posted transaction means adding compensating lines, not editing history. The expected `expense` balance of `0` is the sum of the original `+30` and the reversal's `-30`; an update would leave one line and a different `tx` count.
- **Reusing an existing `(tx,line)` pair.** Q320 inserts `(3,3)` — line 3 of transaction 3. `(3,1)` or `(3,2)` would fail with `UNIQUE constraint failed: ledger.tx, ledger.line`, because the primary key is the pair.
- **Putting Q320's repair on the debit side.** Transaction 3 has 5 more debit than credit, so the repair is a *credit* of 5. A debit of 5 doubles the discrepancy to 10 and no row reads zero.
- **Keeping the `HAVING` clause in Q320.** The point of the exercise is that the result lists all three transactions with zero discrepancy. A leftover `HAVING SUM(debit-credit)<>0` returns an empty list instead of three rows.
- **Expecting `income` to be positive in Q313.** Under the debit-normal convention stated in the prompt the answer is `-115`. Flipping to `SUM(credit-debit)` for readability changes every sign and fails all three rows.
- **Filtering Q317 after grouping.** `account='cash'` restricts which *lines* count, so it is a `WHERE`, and every transaction in this seed touches cash — which is why all three appear even though transaction 2's cash inflow is 0.

## Try it yourself

1. Change Q318's amount to 101 and predict the three rows before running it. Now change the recipient count to 4 and do the same.
2. Rewrite Q314 using `EXISTS` instead of `IN (SELECT tx FROM good)`. Does the result change? Does it still read as clearly?
3. Q319's weights are 1, 2, 3 summing to 6. Work out by hand what happens with weights 1, 1, 1 and an amount of 10, and say which tie-break rule decides the outcome.
4. In words: Q311 and Q312 partition the transactions between them. Describe a ledger for which both queries would return the same transaction, and say what that would imply about the data.

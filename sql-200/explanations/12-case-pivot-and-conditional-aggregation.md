# CASE pivot and conditional aggregation — sql-200 Q111–Q120

**What you practise:** the two forms of `CASE`, and the trick of putting one inside an aggregate so that rows become columns.
**Prerequisites:** [03 GROUP BY HAVING and aggregate policy](03-group-by-having-and-aggregate-policy.md); the difference between `WHERE` and `HAVING`; how `SUM`, `COUNT` and `AVG` treat NULL inputs.
**Exercises:** Q111: searched-case-priority-bands, Q112: simple-case-status-labels, Q113: count-pivot-all-statuses, Q114: sum-pivot-hours-zero-fill, Q115: conditional-average-ignore-other-statuses, Q116: weighted-priority-score, Q117: case-boundary-hours, Q118: conditional-having-open-at-least-two, Q119: closed-percentage-all-tickets, Q120: custom-case-sort-status.

## The problem in plain words

Six tickets belong to two teams. Each has a status (`open`, `closed`, `pending`), an estimate in hours that is sometimes 0 and once NULL, and a priority that is sometimes NULL. Every exercise turns that table into a small report.

`CASE` is SQL's conditional expression. It comes in two forms. A **searched CASE** lists independent conditions — `CASE WHEN hours IS NULL THEN 'unestimated' WHEN hours=0 THEN 'none' … END` — and returns the result of the first one that is true. A **simple CASE** names an operand once and compares it for equality against each branch — `CASE status WHEN 'open' THEN 'todo' … END`, which is exactly `status = 'open'` and so on. The simple form is shorter; the searched form is the only one that can express ranges and `IS NULL`.

**Conditional aggregation** is what happens when a `CASE` goes inside `SUM`, `COUNT` or `AVG`. The `CASE` decides what each row contributes, and the aggregate adds those contributions up per group. One `SUM(CASE WHEN status='open' THEN 1 ELSE 0 END)` counts the open rows; three of them side by side turn the status column into three columns. That is a **pivot**: values that were rows become columns of one row per group.

The family's real subject is what happens at the edges. A missing `ELSE` yields NULL, and each aggregate reacts to NULL differently: `SUM` and `AVG` skip it, `COUNT(*)` does not care, `COUNT(expr)` skips it. Two exercises, Q114 and Q115, differ only in whether the `ELSE 0` is there, and the answers differ because of it.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q111.txt`:

```sql
CREATE TABLE tickets(id INTEGER PRIMARY KEY,team TEXT,status TEXT,hours INTEGER,priority INTEGER);
INSERT INTO tickets VALUES(1,'A','open',2,1),(2,'A','closed',5,3),(3,'A','open',NULL,2),
  (4,'B','closed',3,1),(5,'B','pending',4,NULL),(6,'B','open',0,3);
```

- Team A has three tickets (2 open, 1 closed) and team B three (1 open, 1 closed, 1 pending). Every group therefore has a status with no rows in it, which is what the zero-fill exercises test.
- Ticket 3 has `hours` NULL; ticket 6 has `hours` 0. Those are different values and several exercises distinguish them.
- Ticket 5 has `priority` NULL and is the only `pending` row.
- Aliases are graded exactly: `id, band` (Q111); `id, label` (Q112); `team, open_count, closed_count, pending_count` (Q113); `team, open_hours, closed_hours` (Q114); `team, average_open` (Q115); `team, points` (Q116); `id, size` (Q117); `team, tickets` (Q118); `team, closed_percent` (Q119); `id, status` (Q120).
- Row counts: the per-ticket exercises (Q111, Q112, Q117, Q120) return 6 rows; the per-team ones (Q113–Q116, Q119) return 2; Q118 returns 1.
- Q113 expects `{"team":"A",…,"pending_count":0}` — a zero, not a NULL and not a missing key.
- Q114 expects `{"team":"B","open_hours":0,…}`: team B's only open ticket has 0 hours, so the answer is a genuine zero.
- Q115 expects `{"team":"A","average_open":2}` and `{"team":"B","average_open":0}`. Team A has two open tickets, one with 2 hours and one with NULL, and the average is 2 — so the NULL is excluded from the divisor, not counted as zero.
- Q117 expects `unestimated` for ticket 3 and `none` for ticket 6, which is only possible if the NULL branch is tested before the `hours=0` branch.
- Q118 expects one row, team A with `"tickets":3` — the total count includes the closed ticket even though the filter is about open ones.
- Q119 expects `33.3` for both teams, a number with one decimal place, so the division must be floating point and the result rounded.
- Q120's expected order is ids 5, 1, 3, 6, 2, 4: pending, then the three open in id order, then the two closed in id order.

## Approach

1. **Choose the CASE form from the test you need.** Equality against a handful of literals: simple `CASE`. Ranges, `IS NULL`, or conditions over more than one column: searched `CASE`.
2. **Order the branches deliberately.** Branches are evaluated top to bottom and the first true one wins, so the most specific test goes first. `IS NULL` must precede any comparison, because comparisons against NULL are unknown and fall through.
3. **Always decide what `ELSE` should be.** Omitting it means NULL for the unmatched rows. That is sometimes exactly right (Q115) and sometimes a bug (Q111, where the missing priority must become `'unknown'`).
4. **To pivot, write one aggregate per output column**, each with its own `CASE`, all over the same `GROUP BY`. The table is read once.
5. **Zero-fill with `ELSE 0` inside the aggregate.** `SUM(CASE WHEN … THEN 1 ELSE 0 END)` gives 0 for a group with no matching rows. Without the `ELSE`, `SUM` over an all-NULL group returns NULL.
6. **Suppress rather than zero-fill when averaging.** `AVG(CASE WHEN … THEN hours END)` skips non-matching rows entirely; adding `ELSE 0` would pull them into the divisor and change the answer.
7. **Filter groups with `HAVING`, rows with `WHERE`.** A conditional aggregate in `HAVING` lets you filter on a property of part of the group while still reporting the whole group.
8. **Force floating point before dividing.** `100.0 * x / y` is real division; `100 * x / y` with two integers truncates.
9. **A `CASE` in `ORDER BY` is a sort key, not a column.** It orders the rows without appearing in the result.

## Worked example — Q113 count-pivot-all-statuses

The task, quoted from the prompt: "Pivot counts by team into open_count,closed_count,pending_count columns; missing categories count zero."

**Step 1 — `FROM tickets`.** All six rows.

| id | team | status |
| --- | --- | --- |
| 1 | A | open |
| 2 | A | closed |
| 3 | A | open |
| 4 | B | closed |
| 5 | B | pending |
| 6 | B | open |

**Step 2 — `GROUP BY team`.** Two groups. Nothing is discarded; the rows are assigned to a group and the aggregates will run once per group.

| group | rows |
| --- | --- |
| A | 1 (open), 2 (closed), 3 (open) |
| B | 4 (closed), 5 (pending), 6 (open) |

**Step 3 — evaluate each `CASE` per row.** Three expressions, each producing 1 or 0 for every row. This is the step that turns one status column into three numeric ones.

| id | team | open? | closed? | pending? |
| --- | --- | --- | --- | --- |
| 1 | A | 1 | 0 | 0 |
| 2 | A | 0 | 1 | 0 |
| 3 | A | 1 | 0 | 0 |
| 4 | B | 0 | 1 | 0 |
| 5 | B | 0 | 0 | 1 |
| 6 | B | 1 | 0 | 0 |

**Step 4 — `SUM` each column within the group.**

| team | open_count | closed_count | pending_count |
| --- | --- | --- | --- |
| A | 1+0+1 = 2 | 0+1+0 = 1 | 0+0+0 = 0 |
| B | 0+0+1 = 1 | 1+0+0 = 1 | 0+1+0 = 1 |

Team A's `pending_count` is 0 because the `ELSE 0` gave every row a number to add. Had the `CASE` been written without an `ELSE`, all three of team A's contributions would have been NULL and `SUM` of nothing but NULLs is NULL, not 0.

**Step 5 — `ORDER BY team`.** Two rows, A then B, which is the asserted order in `tests/Q113.cjs`.

The reference solution, as it now reads in `solutions/Q113.sql`:

```sql
-- Why this works:
-- Conditional aggregation pivots rows into columns: one SUM per target
-- status, each summing 1 for a matching row and 0 otherwise.
-- SUM over an all-zero group returns 0, which is what fills team A's
-- pending_count; COUNT(CASE ...) with no ELSE would also give 0, but
-- SUM(CASE ... ELSE 0 END) makes the zero-fill explicit.
-- GROUP BY team produces one row per team, and every status column is
-- computed from the same group, so a single scan builds the whole pivot.
SELECT team,
       SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_count,
       SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed_count,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count
FROM tickets
GROUP BY team
ORDER BY team;
```

**The Q114/Q115 contrast, on team B.** Q114 sums `CASE WHEN status='open' THEN COALESCE(hours,0) ELSE 0 END`: the closed and pending rows contribute 0, the open ticket 6 contributes 0, and `open_hours` is 0. Q115 averages `CASE WHEN status='open' THEN hours END` with no `ELSE`: the closed and pending rows contribute NULL and are ignored, so the average is over the single value 0 and `average_open` is 0. The two answers coincide for team B and diverge for team A, where Q115 returns 2 — the average of ticket 1's 2 hours alone, with ticket 3's NULL hours skipped as well.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q111 | searched-case-priority-bands | "1 urgent, 2 normal, 3 low, NULL unknown" | searched `CASE` over `priority` with `ELSE 'unknown'` |
| Q112 | simple-case-status-labels | "open→todo, closed→done, everything else waiting" | simple `CASE status WHEN … ELSE 'waiting'` |
| Q113 | count-pivot-all-statuses | "pivot counts, missing categories zero" | three `SUM(CASE … THEN 1 ELSE 0 END)` columns |
| Q114 | sum-pivot-hours-zero-fill | "unknown hours contribute zero" | the `THEN` branch becomes `COALESCE(hours,0)` |
| Q115 | conditional-average-ignore-other-statuses | "do not turn non-open rows into zero" | `AVG` and the `ELSE` is dropped entirely |
| Q116 | weighted-priority-score | "urgent=5, normal=2, low=1, unknown=0" | simple `CASE` over `priority` inside one `SUM` |
| Q117 | case-boundary-hours | "NULL, 0, 1..3, >3 — test NULL first" | searched `CASE` whose first branch is `hours IS NULL` |
| Q118 | conditional-having-open-at-least-two | "teams with at least two open tickets" | the conditional `SUM` moves into `HAVING`; the report stays `COUNT(*)` |
| Q119 | closed-percentage-all-tickets | "percentage, one decimal" | `ROUND(100.0 * SUM(CASE …) / COUNT(*), 1)` |
| Q120 | custom-case-sort-status | "pending first, open second, closed last" | the `CASE` moves to `ORDER BY` and is not selected |

## Pitfalls the tests are designed to catch

- **Forgetting `ELSE` when a value is required.** Q111's ticket 5 has a NULL priority; every `WHEN priority = n` is unknown, so without `ELSE 'unknown'` the band is NULL and the expected `"band":"unknown"` fails.
- **Testing `priority = NULL`.** `NULL = 1` and `NULL = NULL` are both unknown. In Q111 the NULL is handled by falling through to `ELSE`; in Q117 it needs an explicit `WHEN hours IS NULL`.
- **Putting the NULL branch last in Q117.** With `WHEN hours=0` first, ticket 3's NULL fails that test, fails `hours<=3`, and lands in `ELSE 'large'`. The expected value is `"unestimated"`.
- **Confusing 0 with NULL.** Ticket 6 has 0 hours and ticket 3 has none. Q117 labels them `none` and `unestimated`; a `COALESCE(hours,0)` at the top of that query would merge the two cases.
- **Adding `ELSE 0` to Q115.** Team A's closed ticket would then contribute 0 instead of being skipped, so the average would be taken over 2 and 0 — ticket 3 still contributes NULL, because its `hours` are NULL — giving 1 instead of the asserted 2.
- **Dropping the `ELSE 0` from Q113.** Team A's `pending_count` becomes NULL, and `assert.deepEqual` distinguishes `null` from `0`.
- **Using `WHERE status='open'` in Q118.** The filter would also shrink the reported `COUNT(*)` to 2; the expected value is 3, the team's full ticket count. `HAVING` filters the group after the count is taken.
- **Integer division in Q119.** `100 * 1 / 3` is 33 in SQLite because both operands are integers. `100.0` makes it 33.333…, and `ROUND(…,1)` makes it 33.3.
- **Selecting the sort key in Q120.** The graded columns are `id, status`. Adding the rank expression to the `SELECT` list produces a third column and fails.
- **Sorting by `status` in Q120.** Alphabetical order is closed, open, pending — the exact reverse of the report's intent. The `CASE` in `ORDER BY` is what imposes the domain order.
- **Assuming the pivot needs a subquery per status.** Three correlated subqueries would return the same numbers and read the table three times; one `GROUP BY` with three conditional aggregates reads it once.

## Try it yourself

1. Add a `cancelled` ticket to team A and predict which of Q113, Q116 and Q119 change, and by how much, before running them.
2. Rewrite Q113 using `COUNT(CASE WHEN status='open' THEN 1 END)` instead of `SUM(… ELSE 0 END)`. Does team A's `pending_count` stay 0? Explain why from how `COUNT(expr)` treats NULL.
3. Write a variant of Q118 that reports teams where *more than half* the tickets are closed. Which part of the `HAVING` clause changes, and does anything in the `SELECT` list?
4. In words: Q114 and Q115 both aggregate open-ticket hours and give different answers for team A. Describe the rule that decides whether a missing value should be treated as zero or as absent.

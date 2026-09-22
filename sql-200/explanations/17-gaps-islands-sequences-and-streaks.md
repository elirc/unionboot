# Gaps islands sequences and streaks — sql-200 Q161–Q170

**What you practise:** comparing a row with its neighbours using `LAG` and `LEAD`, generating rows that are not in any table with a recursive CTE, and the two standard tricks for turning a sequence into runs.
**Prerequisites:** [06 Window offsets frames and analytics](06-window-offsets-frames-and-analytics.md); [07 CTE pipelines and recursive traversal](07-cte-pipelines-and-recursive-traversal.md); `GROUP BY` with `COUNT`, `MIN` and `MAX`.
**Exercises:** Q161: next-visit-gap, Q162: missing-day-gaps-list, Q163: triple-streak-at-least-three-consecutive, Q164: island-identity-both-ends, Q165: largest-island-size, Q166: every-island-start-and-end, Q167: battery-rising-flag, Q168: rising-streak-summed-groups, Q169: longest-nonincreasing-run, Q170: adjacent-duplicate-compress.

## The problem in plain words

Two tables, two shapes of the same question. `visits` holds the days somebody showed up: 1, 2, 4, 5, 6, 9. `battery` holds eight readings in id order: 80, 60, 50, 50, 55, 54, 54, 70.

An **island** is a maximal run of rows that belong together — consecutive days in `visits`, or a run of readings that never drops in `battery`. A **gap** is what lies between two islands. Almost every reporting question about a sequence is one of: how far to the next row, which rows are missing, where does each run start and end, how long is the longest run.

SQL has no loop, so runs are found by giving every row in a run the same computed key and then grouping on it. Two recipes cover everything in this family.

**The difference trick**, for consecutive integers: inside a run, `day` and `ROW_NUMBER()` both increase by exactly one, so `day - ROW_NUMBER() OVER (ORDER BY day)` is constant within a run and changes at a gap. The value itself means nothing; only its equality matters.

**The running-sum trick**, for runs defined by a condition: flag each row 1 when it starts a new run and 0 when it continues one, then take a running `SUM` of those flags. Every row in a run gets the same total, so the total is the group key.

`LAG(col)` and `LEAD(col)` are window functions that read the previous and next row in the window's order without collapsing anything. For the first row `LAG` is NULL, and for the last row `LEAD` is NULL — which is not an error to be suppressed but usually the answer, as in Q161's final gap.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q161.txt`:

```sql
CREATE TABLE visits(id INTEGER PRIMARY KEY,day INTEGER);
INSERT INTO visits VALUES(1,1),(2,2),(3,4),(4,5),(5,6),(6,9);
CREATE TABLE battery(id INTEGER PRIMARY KEY,level INTEGER);
INSERT INTO battery VALUES(1,80),(2,60),(3,50),(4,50),(5,55),(6,54),(7,54),(8,70);
```

- The visit days are 1, 2, 4, 5, 6, 9: three islands of length 2, 3 and 1, with 3, 7 and 8 missing.
- The battery levels contain two equal-neighbour pairs (ids 3–4 at 50, ids 6–7 at 54). Equality is what separates Q168 from a strictly-rising version and what Q170 compresses.
- Aliases: `day, gap` (Q161); `missing` (Q162); `day` (Q163); `day, island` (Q164); `largest` (Q165); `start_day, end_day, size` (Q166); `id, flag` (Q167); `longest` (Q168, Q169); `id, level` (Q170).
- Row counts: Q161 and Q164 return 6, Q162 returns 3, Q163 returns 1, Q165, Q168 and Q169 return a single row, Q166 returns 3, Q167 returns 8, Q170 returns 6.
- Q161 expects `{"day":9,"gap":null}` as its last row: the final `LEAD` is NULL and the NULL must survive into the result.
- Q164's expected island keys are `0,0,1,1,1,3`. They are not 1, 2, 3, and they are not meant to be.
- Q163 expects exactly `[{"day":4}]`. Days 5 and 6 are inside the three-day run but do not start one.
- Q167 expects `{"id":1,"flag":0}` for the first row, and 0 for both repeated readings — the comparison is strictly greater.
- Q168 expects `{"longest":3}` and Q169 `{"longest":4}`. Both count the first row of a run, and in both, equality continues the run.
- Q170 expects ids 1, 2, 3, 5, 6, 8: ids 4 and 7 are dropped as repeats of their predecessor, and id 1 is kept although it has no predecessor.

## Approach

1. **Ask whether the run is defined by arithmetic or by a condition.** Consecutive integers: the difference trick (Q164–Q166). "Never drops", "never rises", "differs from the previous": the flag-and-running-sum trick (Q168, Q169) or a straight neighbour comparison (Q167, Q170).
2. **Name the window's order explicitly.** `OVER (ORDER BY day)` or `OVER (ORDER BY id)` is what makes "previous" and "next" mean anything. It is independent of the statement's own `ORDER BY`.
3. **Handle the first and last row deliberately.** `LAG` and `LEAD` return NULL there. Decide per exercise whether that NULL should surface (Q161), fall through a `CASE` to a default (Q167, Q168), or be tested explicitly with `IS NULL` (Q170).
4. **Compute the window in a subquery or CTE, then filter.** A window function may not appear in `WHERE` or `HAVING`, because those clauses run before the window is evaluated.
5. **For a running sum, state the frame.** `SUM(flag) OVER (ORDER BY id ROWS UNBOUNDED PRECEDING)` means every row from the start of the partition up to the current one. That is the frame you want for a group key.
6. **Aggregate twice in two steps.** "The largest run" is `MAX` of `COUNT`, and an aggregate may not be nested directly inside another, so the counting happens in one CTE and the `MAX` in the query that selects from it.
7. **Generate rows with a recursive CTE when the answer is about data that is absent.** A `WITH RECURSIVE` has a seed arm, `UNION ALL`, and a recursive arm that must eventually stop.
8. **Look more than one row ahead with the offset argument.** `LEAD(day,2)` reads two rows forward, which is how Q163 checks a three-day window in one pass.

## Worked example — Q164 island-identity-both-ends

The task, quoted from the prompt: "Assign island numbers by day minus ROW_NUMBER, returning every visit with group id, ordered by day."

**Step 1 — `FROM visits`, ordered by day** (the window's order, not yet the output's).

| day |
| --- |
| 1 |
| 2 |
| 4 |
| 5 |
| 6 |
| 9 |

**Step 2 — `ROW_NUMBER() OVER (ORDER BY day)`.** Consecutive integers from 1, one per row, regardless of the values.

| day | row number |
| --- | --- |
| 1 | 1 |
| 2 | 2 |
| 4 | 3 |
| 5 | 4 |
| 6 | 5 |
| 9 | 6 |

**Step 3 — subtract.** Inside a run both columns step by 1, so the difference holds still. At a gap the day jumps further than the row number and the difference increases by the size of the gap.

| day | row number | `day - row number` |
| --- | --- | --- |
| 1 | 1 | 0 |
| 2 | 2 | 0 |
| 4 | 3 | **1** |
| 5 | 4 | 1 |
| 6 | 5 | 1 |
| 9 | 6 | **3** |

Three distinct keys, one per island. The jump from 0 to 1 is the missing day 3; the jump from 1 to 3 is the two missing days 7 and 8.

**Step 4 — `SELECT day, … AS island` and `ORDER BY day`.** The six rows above are exactly what `tests/Q164.cjs` asserts, including the key values `0,0,1,1,1,3`.

The reference solution, as it now reads in `solutions/Q164.sql`:

```sql
-- Why this works:
-- This is the gaps-and-islands trick. ROW_NUMBER() numbers the visits
-- 1,2,3,... in day order, and within a run of consecutive days both day and
-- the row number increase by exactly one.
-- Their difference is therefore constant inside a run and jumps whenever a
-- day is missing, which makes it a group key for the run.
-- The key's value carries no meaning of its own: days 1,2 give 0, days
-- 4,5,6 give 1, day 9 gives 3. Only equality matters.
SELECT day,
       day - ROW_NUMBER() OVER (ORDER BY day) AS island
FROM visits
ORDER BY day;
```

**Q165 and Q166 build on that key.** Group by `island` and the three runs become three rows: `COUNT(*)` gives sizes 2, 3, 1 (Q165 then takes `MAX`, giving 3), and `MIN(day)`/`MAX(day)` give the pairs 1–2, 4–6 and 9–9 (Q166). The island key is never reported, because its value is an artefact.

**Q168 traced, because the running-sum trick looks like magic until you see the columns.** Battery levels in id order, flag = 0 while `level >= LAG(level)`, else 1:

| id | level | `LAG(level)` | `level >= LAG` | new_run | running sum |
| --- | --- | --- | --- | --- | --- |
| 1 | 80 | NULL | unknown | 1 | 1 |
| 2 | 60 | 80 | false | 1 | 2 |
| 3 | 50 | 60 | false | 1 | 3 |
| 4 | 50 | 50 | true | 0 | 3 |
| 5 | 55 | 50 | true | 0 | 3 |
| 6 | 54 | 55 | false | 1 | 4 |
| 7 | 54 | 54 | true | 0 | 4 |
| 8 | 70 | 54 | true | 0 | 4 |

Group sizes by running sum: 1, 1, 3, 3. `MAX` is 3, which is the asserted `{"longest":3}`. Row 1's `LAG` is NULL, the comparison is unknown rather than true, and the `ELSE 1` starts the first run — no special case needed. Q169 flips the comparison to `<=` and the same machinery gives 4, for the run 80, 60, 50, 50.

## Policy matrix — what changes between the variants

| ID | Variant | The question | What changes in the SQL |
| --- | --- | --- | --- |
| Q161 | next-visit-gap | "how long until the next visit" | `LEAD(day) OVER (ORDER BY day) - day` |
| Q162 | missing-day-gaps-list | "which days are absent" | `WITH RECURSIVE` generates min..max, then `NOT EXISTS` |
| Q163 | triple-streak-at-least-three-consecutive | "which days start a run of 3" | `LEAD(day,1)` and `LEAD(day,2)`, filtered outside the subquery |
| Q164 | island-identity-both-ends | "which run is each visit in" | `day - ROW_NUMBER() OVER (ORDER BY day)` |
| Q165 | largest-island-size | "how long is the longest run" | the same key, then `COUNT(*)` per island, then `MAX` |
| Q166 | every-island-start-and-end | "where does each run begin and end" | the same key, then `MIN(day)`, `MAX(day)`, `COUNT(*)` |
| Q167 | battery-rising-flag | "did this reading go up" | `CASE WHEN level > LAG(level) OVER (ORDER BY id) THEN 1 ELSE 0 END` |
| Q168 | rising-streak-summed-groups | "longest non-decreasing run" | flag with `>=`, running `SUM`, `COUNT`, `MAX` |
| Q169 | longest-nonincreasing-run | "longest non-increasing run" | identical, with the comparison flipped to `<=` |
| Q170 | adjacent-duplicate-compress | "drop repeats of the previous reading" | `WHERE prev IS NULL OR level <> prev` over a `LAG` subquery |

## Pitfalls the tests are designed to catch

- **Putting a window function in `WHERE`.** `WHERE LEAD(day) OVER (…) = day + 1` is an error: the window is computed after `WHERE`. Q163 and Q170 both push the window into a subquery for this reason.
- **Suppressing the trailing NULL in Q161.** `COALESCE(LEAD(day) OVER (…) - day, 0)` gives `"gap":0` where `null` is asserted.
- **Comparing with NULL instead of testing for it in Q170.** `WHERE level <> prev` is unknown for row 1, so the first reading disappears and five rows come back instead of six.
- **Using a strict comparison where equality should continue the run.** Q168 with `>` instead of `>=` splits 50, 50 and 54, 54, so the longest run becomes 2.
- **Using a non-strict comparison in Q167.** The flag is "strictly exceeds", so ids 4 and 7 must be 0. `>=` would flag them 1.
- **Forgetting that `ROW_NUMBER` needs the same order as the value.** `day - ROW_NUMBER() OVER (ORDER BY id)` happens to work here because `id` and `day` rise together; with rows inserted out of order it would produce nonsense keys.
- **Reporting the island key.** Q165 and Q166 assert `largest` / `start_day,end_day,size`; the key is an implementation detail and adding it to the `SELECT` list fails the column check.
- **Nesting aggregates.** `MAX(COUNT(*))` is rejected with "misuse of aggregate function". The two levels need two query blocks, which is what the CTEs in Q165, Q168 and Q169 provide.
- **Omitting the frame from the running sum.** `SUM(flag) OVER (ORDER BY id)` defaults to `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which sums *all peer rows* with the same `id` value — the same thing here because `id` is unique, but the explicit `ROWS UNBOUNDED PRECEDING` says what is meant and is safe when the ordering column has ties.
- **Letting a recursive CTE run away.** Q162's recursive arm needs `WHERE day < span.last_day`; without a termination condition the query does not stop.
- **Using `UNION` instead of `UNION ALL` in Q162.** SQLite's recursive CTE accepts `UNION`, but it then deduplicates on every step, which is both slower and a different algorithm; `UNION ALL` is the form these generated rows want.
- **Reading Q163 as "days inside a run".** Days 5 and 6 belong to the 4–5–6 island but do not start a three-day run — for day 5, `LEAD(day,2)` is 9. The expected answer is one row.
- **Assuming `LEAD(day,2)` skips gaps.** It reads two *rows* ahead, not two days ahead; the arithmetic `= day + 2` is what tests for consecutiveness.

## Try it yourself

1. Add a visit on day 7 and predict, before running, the new results of Q162, Q164, Q165 and Q166.
2. Rewrite Q165 without the island key, using `LAG` and a running sum instead. Which trick produces shorter SQL, and does either become wrong if two visits share a day?
3. Write "the start and end day of the longest island", combining Q165 and Q166. Where does the tiebreak go if two islands are equally long?
4. In words: the difference trick and the running-sum trick both produce a constant key per run. Describe a sequence where the difference trick cannot be used, and say why the running-sum trick still can.

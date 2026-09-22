# Window offsets frames and analytics — sql-200 Q051–Q060

**What you practise:** reaching at another row with `LAG`/`LEAD`, and controlling exactly which rows an aggregate window sees with a `ROWS` or `RANGE` frame.
**Prerequisites:** [05 Ranking and top N per group](05-ranking-and-top-n-per-group.md) for `OVER (PARTITION BY … ORDER BY …)`; `AVG`/`SUM`; integer versus real division.
**Exercises:** Q051: lag-previous-reading-null-boundary, Q052: lead-next-reading-zero-boundary, Q053: lag-delta-null-first, Q054: running-total-rows-frame, Q055: running-total-range-day-peers, Q056: moving-average-two-rows, Q057: centered-three-row-average, Q058: last-value-full-partition, Q059: share-of-partition-total, Q060: moving-calendar-range-one-day.

## The problem in plain words

Six sensor readings. Each has a `sensor` (A or B), a `day` (an integer, not a date) and a `value`. Sensor A has two readings on day 2, which is the detail every frame exercise is built around.

Family 05 used windows to *number* rows. This family uses them to *read* other rows. Two tools do that.

`LAG(expr)` and `LEAD(expr)` fetch the value of `expr` from a row a fixed number of positions away inside the partition, in the window's `ORDER BY` order. At the first row of a partition there is no previous row, so `LAG` returns NULL; at the last row `LEAD` returns NULL. Both accept an optional third argument, a default to use instead of NULL.

Aggregate windows — `SUM(x) OVER (…)`, `AVG(x) OVER (…)` — compute over a *frame*, a sub-range of the partition that moves with the current row. The frame is spelled out after the window's `ORDER BY`:

```sql
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
```

`ROWS` counts physical rows. `RANGE` counts *values of the ordering column*: every row whose ordering value is within the stated distance of the current row's is in the frame, so peers with an identical ordering value all see the same frame and produce the same answer. On sensor A's two day-2 rows, `ROWS` gives them different running totals (30 and 60) and `RANGE` gives them both 60. Q054 and Q055 are that one-word difference.

The default frame, when you write an `ORDER BY` in `OVER` but no frame clause, is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. That default is why `LAST_VALUE` surprises people: with the default frame the "last" row is the current row, so Q058 has to state the frame explicitly.

## The contract you must honour

All ten exercises share one seed, quoted from `prompts/Q051.txt`:

```sql
CREATE TABLE readings(id INTEGER PRIMARY KEY,sensor TEXT,day INTEGER,value INTEGER);
INSERT INTO readings VALUES(1,'A',1,10),(2,'A',2,20),(3,'A',2,30),(4,'A',4,40),
  (5,'B',1,5),(6,'B',3,15);
```

- Sensor A holds ids 1–4 on days 1, 2, 2, 4. Sensor B holds ids 5–6 on days 1 and 3. The duplicate day and the day-3 gap are both load-bearing.
- `day` is an `INTEGER`, not a date string. `RANGE BETWEEN 1 PRECEDING AND CURRENT ROW` therefore means "day minus 1 to day", plain arithmetic — no date functions are involved in this family.
- Every exercise returns six rows and `ORDER BY id`. Nothing is filtered out.
- Aliases: `id, previous` (Q051); `id, next` (Q052); `id, delta` (Q053); `id, total` (Q054, Q055, Q060); `id, average` (Q056, Q057); `id, last_value` (Q058); `id, percent` (Q059).
- Q051 expects `null` at each partition's first row (ids 1 and 5). Q052 expects `0` at each partition's last row (ids 4 and 6), which is the third argument of `LEAD`, not a `COALESCE` applied afterwards — either produces the same rows here, but the prompt says "with zero at the end".
- Q053's first delta per sensor is `null`: `value - NULL` is NULL, so no special case is needed.
- Q054 versus Q055 on ids 2 and 3: `ROWS` gives `30` then `60`; `RANGE` gives `60` and `60`. The prompt for Q055 states the requirement as "both A day=2 rows see the same accumulated total".
- Q056 and Q057 round to two decimals; every expected value here happens to be exact (`10, 15, 25, 35, 5, 10` and `15, 20, 30, 35, 10, 10`).
- Q059 says "use real division". `100*value/SUM(...)` with integer operands would floor; the reference multiplies by `100.0` to force real arithmetic.
- Q060's expected `{"id":4,"total":40}` proves the frame is by day value, not by row: id 4 is on day 4, day 3 has no A reading, so the frame holds only id 4 itself.
- Window order and result order are separate. Every window here orders by `day,id` (or by nothing, in Q059), while the statement orders by `id`.

## Approach

1. **Partition by `sensor` in every exercise.** No question in this family crosses sensors, and without `PARTITION BY` sensor B's first reading would see sensor A's last.
2. **Order the window by `day, id`.** `day` is the intended sequence; `id` breaks the day-2 tie so `LAG` and `ROWS` frames are deterministic. Q055 and Q060 deliberately order by `day` alone, because `RANGE` requires the ordering value to be the thing measured.
3. **Use `LAG`/`LEAD` for a single neighbour, a frame for a set of rows.** "The previous reading" is `LAG`; "the last two readings" is `ROWS BETWEEN 1 PRECEDING AND CURRENT ROW`.
4. **Give `LEAD` a default when the prompt names a boundary value.** `LEAD(value,1,0)` — offset 1, default 0.
5. **Choose `ROWS` when the question counts rows, `RANGE` when it counts values of the ordering column.** "One preceding row" is `ROWS`; "one day before" is `RANGE`.
6. **Spell the frame out for `LAST_VALUE`.** `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` makes the frame the whole partition, so the last row of the frame is the last row of the partition.
7. **Omit the window's `ORDER BY` for a whole-partition aggregate.** `SUM(value) OVER (PARTITION BY sensor)` has no ordering, so the frame is the entire partition and every row sees the same total — which is what a share-of-total calculation needs (Q059).
8. **Force real division before rounding.** `100.0 * value / total` promotes the whole expression to real; `ROUND(x,1)` then trims it.

## Worked example — Q051 lag-previous-reading-null-boundary

The task: "Show previous value per sensor ordered by day,id, with NULL for first row; output ordered by id."

**Step 1 — FROM readings.** All six rows.

| id | sensor | day | value |
| --- | --- | --- | --- |
| 1 | A | 1 | 10 |
| 2 | A | 2 | 20 |
| 3 | A | 2 | 30 |
| 4 | A | 4 | 40 |
| 5 | B | 1 | 5 |
| 6 | B | 3 | 15 |

**Step 2 — PARTITION BY sensor.** Two independent sequences; `LAG` never crosses the boundary.

| partition | rows in window order (`day, id`) |
| --- | --- |
| A | id 1 (d1, 10), id 2 (d2, 20), id 3 (d2, 30), id 4 (d4, 40) |
| B | id 5 (d1, 5), id 6 (d3, 15) |

Ids 2 and 3 share day 2. The `id` key in the window's `ORDER BY` is what puts 2 before 3; without it the pair's order — and therefore their `LAG` values — would be arbitrary.

**Step 3 — LAG(value) at each position.** Offset defaults to 1, and the default value defaults to NULL.

| partition position | id | value | row one back | `previous` |
| --- | --- | --- | --- | --- |
| A 1st | 1 | 10 | none | NULL |
| A 2nd | 2 | 20 | id 1 | 10 |
| A 3rd | 3 | 30 | id 2 | 20 |
| A 4th | 4 | 40 | id 3 | 30 |
| B 1st | 5 | 5 | none | NULL |
| B 2nd | 6 | 15 | id 5 | 5 |

Both partition-first rows get NULL, which is why the expected result has two `null`s rather than one.

**Step 4 — SELECT id, … AS previous.** The alias is required; the expression's own name would be the whole `LAG(...)` text.

**Step 5 — ORDER BY id.** The rows come back 1 to 6. The window order and the output order agree by coincidence here; in Q055 they do not.

The asserted rows in `tests/Q051.cjs`:

```sql
-- [{"id":1,"previous":null},{"id":2,"previous":10},{"id":3,"previous":20},
--  {"id":4,"previous":30},{"id":5,"previous":null},{"id":6,"previous":5}]
```

The reference solution, as it now reads in `solutions/Q051.sql`:

```sql
-- Why this works:
-- LAG reads the value of the row one position earlier inside the partition,
-- in the window's ORDER BY order.
-- PARTITION BY sensor stops sensor B's first reading from borrowing sensor
-- A's last one, which is why two rows come back with previous NULL.
-- ORDER BY day,id inside the window settles the two A readings that share day
-- 2; without the id key their relative order, and so their LAG values, would
-- be arbitrary.
-- No default argument is given, so the first row of each partition gets NULL,
-- exactly as the prompt requires.
SELECT id,
       LAG(value) OVER (PARTITION BY sensor ORDER BY day, id) AS previous
FROM readings
ORDER BY id;
```

**The Q054/Q055 contrast, on sensor A.** Both accumulate from the start of the partition.

| id | day | value | `ROWS … CURRENT ROW` (Q054) | `RANGE … CURRENT ROW` (Q055) |
| --- | --- | --- | --- | --- |
| 1 | 1 | 10 | 10 | 10 |
| 2 | 2 | 20 | 30 | 60 |
| 3 | 2 | 30 | 60 | 60 |
| 4 | 4 | 40 | 100 | 100 |

`ROWS` stops at the physical current row, so id 2 has not yet seen id 3. `RANGE` includes every row whose `day` is less than or equal to 2, so both day-2 rows see each other. Note that Q055's window orders by `day` only — with `day, id` in the `ORDER BY`, the range key would be the pair and the peer grouping would be lost.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q051 | lag-previous-reading-null-boundary | "previous value … NULL for first row" | `LAG(value) OVER (PARTITION BY sensor ORDER BY day,id)` |
| Q052 | lead-next-reading-zero-boundary | "next value … zero at the end" | `LEAD(value,1,0)` — offset and default arguments |
| Q053 | lag-delta-null-first | "change from the previous row" | subtract: `value - LAG(value) OVER (…)` |
| Q054 | running-total-rows-frame | "explicit ROWS frame" | `SUM(value) OVER (… ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` |
| Q055 | running-total-range-day-peers | "both A day=2 rows see the same total" | `RANGE` instead of `ROWS`, and the window orders by `day` alone |
| Q056 | moving-average-two-rows | "current and one preceding" | `AVG(value) OVER (… ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)` |
| Q057 | centered-three-row-average | "preceding, current and following" | frame end becomes `1 FOLLOWING` |
| Q058 | last-value-full-partition | "final reading on every row … through UNBOUNDED FOLLOWING" | `LAST_VALUE(value) OVER (… ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)` |
| Q059 | share-of-partition-total | "percentage of sensor total … real division" | no window `ORDER BY` at all: `100.0*value/SUM(value) OVER (PARTITION BY sensor)` |
| Q060 | moving-calendar-range-one-day | "current day and one day before, numeric RANGE" | `RANGE BETWEEN 1 PRECEDING AND CURRENT ROW` over `ORDER BY day` |

## Pitfalls the tests are designed to catch

- **Omitting `PARTITION BY sensor`.** Id 5 would take its `LAG` from id 4 and report `40` instead of `null`, and every running total would carry A's sum into B.
- **Omitting the `id` tiebreak in a `ROWS` window.** Ids 2 and 3 share day 2. `ROWS` frames and `LAG` both depend on their relative order, which is unspecified without the second key, so the query can pass once and fail later.
- **Adding the `id` tiebreak to a `RANGE` window.** Q055 and Q060 need peers on the same `day` to share a frame. Ordering by `day, id` makes every key unique and the two day-2 rows stop being peers, turning Q055's answer back into Q054's.
- **`LAST_VALUE` with the default frame.** With `ORDER BY` and no frame clause, the frame ends at the current row, so `LAST_VALUE` returns the current row's own value: `10, 20, 30, 40, 5, 15`. The prompt's "Explicitly extend … through UNBOUNDED FOLLOWING" is the fix. (`FIRST_VALUE` looks correct under the default frame, which is why the asymmetry catches people.)
- **`COALESCE(LEAD(value),0)` versus `LEAD(value,1,0)`.** Both give Q052's expected rows. The three-argument form is what the prompt describes and it keeps a genuine NULL *value* distinguishable from a missing row — a distinction that would matter if `value` were nullable.
- **Special-casing the first delta in Q053.** `value - NULL` is already NULL in SQL, so `CASE WHEN … IS NULL` adds nothing. Arithmetic with NULL propagates NULL.
- **Integer division in Q059.** Every quotient on this seed is exact (`1000/100`, `1500/20`, …), so an all-integer `100*value/SUM(value) OVER (…)` happens to produce the same six numbers and the test would pass. The prompt still says "use real division", and the reviewer reads the file: any total that does not divide `100 * value` exactly exposes the difference — `100*1/6` is `16` under integer division and `16.7` after `ROUND(100.0*1/6,1)`. `100.0*` forces real arithmetic throughout.
- **Confusing `ROWS 1 PRECEDING` with `RANGE 1 PRECEDING`.** In Q060, id 4 sits on day 4 with no day-3 reading, so the frame is just itself and the total is `40`. A `ROWS` frame would have included id 3 and returned `70`.
- **Assuming a boundary frame is an error.** At id 1 a `1 PRECEDING` frame simply contains one row, and `AVG` divides by 1. Q056 expects `{"id":1,"average":10}`, not NULL.
- **Filtering with a window function.** As in family 05, a window may not appear in `WHERE`. No exercise here needs it, but the same CTE workaround applies.
- **Reporting the helper column.** Only the two graded columns may appear; `deepEqual` rejects an extra key.

## Try it yourself

1. Change Q054's frame to `ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING` and say, before running it, what sensor B's two rows become.
2. Add a reading `(7,'A',4,50)` and predict how Q055 and Q060 change for id 4.
3. Write "the value two readings ago, or -1 if there is none" for each sensor. Which two arguments of `LAG` do you need?
4. In words: Q058 needs an explicit frame but an equivalent `FIRST_VALUE` query would not. Explain why, in terms of the default frame.

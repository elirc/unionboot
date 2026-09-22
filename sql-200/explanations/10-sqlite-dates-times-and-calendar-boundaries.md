# SQLite dates times and calendar boundaries — sql-200 Q091–Q100

**What you practise:** SQLite's five date functions, the modifier strings they take, and the calendar edge cases — leap day, year end, week start — that a naive expression gets wrong.
**Prerequisites:** [03 GROUP BY HAVING and aggregate policy](03-group-by-having-and-aggregate-policy.md); string comparison; `CAST`.
**Exercises:** Q091: date-part-iso-text, Q092: half-open-month-filter, Q093: month-group-strftime, Q094: leap-year-end-of-month, Q095: fixed-offset-day-shift, Q096: elapsed-hours-julianday, Q097: weekend-sunday-zero, Q098: monday-week-bucket, Q099: unixepoch-explicit-modifier, Q100: calendar-day-age-fixed-asof.

## The problem in plain words

SQLite has no date or time storage type. A timestamp is a `TEXT` string, an `INTEGER` count of seconds, or a `REAL` Julian day number, and the date functions read whichever you give them. That is the first thing to internalise, and it is why `GUIDE.txt` lists dynamic typing as a SQLite caveat.

Five functions do the work:

| Function | Returns | Example |
| --- | --- | --- |
| `date(x, mod…)` | `'YYYY-MM-DD'` | `date('2024-02-28 23:30:00')` → `'2024-02-28'` |
| `time(x, mod…)` | `'HH:MM:SS'` | |
| `datetime(x, mod…)` | `'YYYY-MM-DD HH:MM:SS'` | `datetime(0,'unixepoch')` → `'1970-01-01 00:00:00'` |
| `julianday(x, mod…)` | a `REAL` day count | differences give elapsed days |
| `strftime(fmt, x, mod…)` | `TEXT` formatted as `fmt` | `strftime('%Y-%m', x)`, `strftime('%w', x)` |

Everything after the value is a **modifier**: a string applied in order, left to right. `'+1 day'`, `'-3 days'`, `'start of month'`, `'+2 hours'`, `'unixepoch'`. Chaining them is how calendar arithmetic is expressed — `date(x,'start of month','+1 month','-1 day')` is "the last day of x's month", and it is correct in February of a leap year without any special case.

Two things SQLite deliberately does not do. It has no IANA time-zone database, so `'+2 hours'` is a fixed offset and never a daylight-saving conversion — Q095's prompt says so in its own words. And `'unixepoch'` must be stated explicitly to read an integer as epoch seconds; Q099's prompt forbids relying on automatic detection.

The last theme is boundaries. Because the seed straddles a leap day (2024-02-29), a month end (2024-03-01) and a year end (2024-12-31), every exercise has at least one row that a half-correct expression gets wrong.

## The contract you must honour

The seed for Q091–Q098 and Q100, quoted from `prompts/Q091.txt`:

```sql
CREATE TABLE events(id INTEGER PRIMARY KEY,happened_at TEXT);
INSERT INTO events VALUES(1,'2024-02-28 23:30:00'),(2,'2024-02-29 00:30:00'),
  (3,'2024-03-01 12:00:00'),(4,'2024-03-03 09:00:00'),(5,'2024-12-31 23:00:00');
```

**Q099 seeds an extra table** — `CREATE TABLE epochs(seconds INTEGER)` with rows `0`, `86400` and `1709164800` — and ignores `events` entirely.

The five timestamps, with their weekdays, are:

| id | happened_at | weekday | `%w` |
| --- | --- | --- | --- |
| 1 | 2024-02-28 23:30:00 | Wednesday | 3 |
| 2 | 2024-02-29 00:30:00 | Thursday | 4 |
| 3 | 2024-03-01 12:00:00 | Friday | 5 |
| 4 | 2024-03-03 09:00:00 | Sunday | 0 |
| 5 | 2024-12-31 23:00:00 | Tuesday | 2 |

- 2024 is a leap year, so February has 29 days. Q094's expected `month_end` for ids 1 and 2 is `2024-02-29`, which a hard-coded `'+28 days'` would get wrong.
- Timestamps are stored as ISO text, so a plain string comparison sorts chronologically. Q092 relies on that: `happened_at >= '2024-02-01' AND happened_at < '2024-03-01'`.
- `strftime` returns **text**, not a number. Q097's expected row is `{"id":4,"weekday":"0"}` — the string `"0"`, not the number `0`. Q093's `month` is likewise the string `"2024-02"`.
- Q096 expects `{"hours":1}`. `julianday` differences are real, and `ROUND(1.0, 2)` arrives in JavaScript as the number `1`.
- Q097 expects exactly one row. Only id 4 falls on a weekend, and `%w` uses Sunday = 0, Saturday = 6.
- Q098 expects ids 1–4 all to map to `2024-02-26`, including id 4 which is a Sunday — the prompt says "Sunday belongs to the prior Monday", which is the ISO convention and not what `%w` gives you directly.
- Q099 expects the `seconds` column back as an integer alongside the formatted `utc` text, and `1709164800` must render as `2024-02-29 00:00:00`.
- Q100 fixes "now" at `2024-03-04` and returns **4** rows: id 5 is after that date and is excluded. Ages are whole days computed on dates, not on timestamps, so id 1 (which happened at 23:30) is `5` days old, not 4.
- Aliases: `id, day` (Q091); `id` (Q092); `month, events` (Q093); `id, month_end` (Q094); `id, local_day` (Q095); `hours` (Q096); `id, weekday` (Q097); `id, week_start` (Q098); `seconds, utc` (Q099); `id, age_days` (Q100).

## Approach

1. **Use `date()` to drop the time part.** `date(happened_at)` truncates to the day; it does not round.
2. **Filter a month with a half-open range.** `>= start AND < next_start` includes every timestamp on the last day, whatever its time. A closed `BETWEEN '2024-02-01' AND '2024-02-29'` would not: as strings, `'2024-02-29 00:30:00'` is greater than `'2024-02-29'`, so every event after midnight on the last day would be excluded.
3. **Group by a formatted string.** `strftime('%Y-%m', happened_at) AS month` then `GROUP BY month`. SQLite lets a `GROUP BY` reference a select-list alias, which keeps the expression written once.
4. **Chain modifiers for calendar arithmetic.** `'start of month'` snaps to midnight on the first; `'+1 month'` then `'-1 day'` lands on the last day of the original month, leap years included.
5. **Shift by a fixed offset with `'+N hours'`.** Apply it inside `date()` so that the day is computed after the shift.
6. **Measure elapsed time with `julianday` differences.** `(julianday(b) - julianday(a)) * 24` is hours; `* 1440` would be minutes. The result is real, so `ROUND` it.
7. **Read weekdays with `strftime('%w', x)`,** remembering it returns text and that Sunday is `'0'`.
8. **Convert `%w` to a Monday-based offset with `(w + 6) % 7`.** That maps Monday 1 → 0, Tuesday 2 → 1, … Saturday 6 → 5, Sunday 0 → 6, which is the number of days to subtract. `CAST(... AS INTEGER)` is needed first because `%w` is text.
9. **Name the epoch encoding explicitly.** `datetime(seconds,'unixepoch')` reads the integer as seconds since 1970-01-01 UTC.
10. **Fix "now" as a literal.** Nothing in this pack may read the wall clock; Q100 hard-codes `'2024-03-04'`.

## Worked example — Q091 date-part-iso-text

The task: "Extract the date from each ISO timestamp using SQLite date(); order by id."

**Step 1 — FROM events.** Five rows, no filter.

| id | happened_at |
| --- | --- |
| 1 | 2024-02-28 23:30:00 |
| 2 | 2024-02-29 00:30:00 |
| 3 | 2024-03-01 12:00:00 |
| 4 | 2024-03-03 09:00:00 |
| 5 | 2024-12-31 23:00:00 |

**Step 2 — apply `date(happened_at)`.** The function parses the text as a date-time, then formats just the date part. No modifier is given, so nothing is shifted.

| id | input | `date(...)` |
| --- | --- | --- |
| 1 | 2024-02-28 23:30:00 | 2024-02-28 |
| 2 | 2024-02-29 00:30:00 | 2024-02-29 |
| 3 | 2024-03-01 12:00:00 | 2024-03-01 |
| 4 | 2024-03-03 09:00:00 | 2024-03-03 |
| 5 | 2024-12-31 23:00:00 | 2024-12-31 |

Note ids 1 and 5: both are late in the evening, and `date()` truncates rather than rounding, so neither moves to the next day. Q095 is the exercise where they do move, because a `'+2 hours'` modifier is applied first.

**Step 3 — SELECT id, … AS day.** The alias is required; the column would otherwise be named after the function-call text.

**Step 4 — ORDER BY id.**

The asserted rows in `tests/Q091.cjs`:

```sql
-- [{"id":1,"day":"2024-02-28"},{"id":2,"day":"2024-02-29"},
--  {"id":3,"day":"2024-03-01"},{"id":4,"day":"2024-03-03"},
--  {"id":5,"day":"2024-12-31"}]
```

The values are strings, not dates: SQLite has no date type, and `node:sqlite` hands text back as JavaScript strings.

The reference solution, as it now reads in `solutions/Q091.sql`:

```sql
-- Why this works:
-- date() parses the stored text as a date-time and formats only the date
-- part, so the time is dropped rather than rounded: id 1 at 23:30 stays on
-- 2024-02-28 and id 5 at 23:00 stays on 2024-12-31.
-- No modifier is supplied, so no shifting happens; Q095 is the variant that
-- adds one.
-- The result is TEXT. SQLite has no date storage type, so the graded values
-- are strings such as '2024-02-28'.
SELECT id,
       date(happened_at) AS day
FROM events
ORDER BY id;
```

**The Q094 modifier chain, traced on id 1.** Modifiers apply left to right:

| stage | value |
| --- | --- |
| input | `2024-02-28 23:30:00` |
| `'start of month'` | `2024-02-01 00:00:00` |
| `'+1 month'` | `2024-03-01 00:00:00` |
| `'-1 day'` | `2024-02-29 00:00:00` |
| `date(...)` formats | `2024-02-29` |

The leap day falls out of the arithmetic; nothing in the query mentions February or 29.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q091 | date-part-iso-text | "extract the date" | `date(happened_at)` |
| Q092 | half-open-month-filter | "inclusive lower and exclusive March upper" | `WHERE happened_at>='2024-02-01' AND happened_at<'2024-03-01'` — string comparison, no function |
| Q093 | month-group-strftime | "count events by YYYY-MM" | `strftime('%Y-%m',happened_at) AS month` plus `GROUP BY month` |
| Q094 | leap-year-end-of-month | "month-end via start of month,+1 month,-1 day" | a three-modifier chain inside `date()` |
| Q095 | fixed-offset-day-shift | "fixed +2 hour offset (not a time zone)" | `date(happened_at,'+2 hours')` |
| Q096 | elapsed-hours-julianday | "elapsed hours from event 1 to event 2" | a self `CROSS JOIN` pinned to two ids, `(julianday(b)-julianday(a))*24` |
| Q097 | weekend-sunday-zero | "weekend events using %w" | `strftime('%w',…) IN('0','6')` — text literals |
| Q098 | monday-week-bucket | "Monday of the week … Sunday belongs to the prior Monday" | `date(x,'-'||((CAST(strftime('%w',x) AS INTEGER)+6)%7)||' days')` |
| Q099 | unixepoch-explicit-modifier | "integer epoch seconds … do not use auto" | `datetime(seconds,'unixepoch')` over the `epochs` table |
| Q100 | calendar-day-age-fixed-asof | "as of fixed 2024-03-04 … no wall-clock now" | `CAST(julianday('2024-03-04')-julianday(date(x)) AS INTEGER)` plus a `WHERE` cutoff |

## Pitfalls the tests are designed to catch

- **Hard-coding a month length.** `date(x,'+28 days')` or `'2024-02-28'` as February's end breaks on a leap year. Q094 expects `2024-02-29` for ids 1 and 2, and the modifier chain produces it without knowing the month.
- **Using `BETWEEN` for a month range.** `BETWEEN '2024-02-01' AND '2024-02-29'` compares strings, and `'2024-02-29 00:30:00'` is greater than `'2024-02-29'`, so id 2 would be excluded. The half-open `< '2024-03-01'` form has no such edge.
- **Comparing `date(happened_at)` when a string comparison suffices.** It works, but it prevents an index on `happened_at` from being used. Q092's prompt asks for timestamp bounds.
- **Treating `strftime` output as a number.** `strftime('%w',x)` returns `'0'`, a string. Q097's expected `weekday` is `"0"`, and the filter uses `IN('0','6')` with quoted literals. Q098 has to `CAST(... AS INTEGER)` before doing arithmetic.
- **Getting the week start off by one.** `%w` numbers Sunday as 0, so subtracting `%w` days lands on Sunday, not Monday. `(w + 6) % 7` rotates the week: Monday → 0, Sunday → 6. Id 4 is a Sunday and must map back six days to `2024-02-26`, not forward to `2024-03-04`.
- **Applying the offset after truncating.** `date(happened_at)` then `'+2 hours'` would shift a midnight, not the real timestamp. Q095 applies the modifier inside the same `date()` call, which is why ids 1 and 5 roll over to the next day — and id 5 rolls into the next *year*, `2025-01-01`.
- **Assuming `'+2 hours'` is a time zone.** It is a fixed arithmetic offset. SQLite has no IANA database and does no daylight-saving adjustment; the prompt states this.
- **Relying on automatic epoch detection.** `datetime(1709164800)` without `'unixepoch'` reads the number as a Julian day, which is far outside the supported range, and returns **NULL** rather than an error. Q099's prompt says "do not use auto", and a missing modifier fails the test with three nulls, not with a wrong date.
- **Comparing timestamps instead of dates in Q100.** The age must be in whole calendar days, so `julianday` is applied to `date(happened_at)`, not to the raw value. Id 1 happened at 23:30 on 2024-02-28; on dates that is 5 days before 2024-03-04, but on raw timestamps the difference is 4.02 days and `CAST` would floor it to 4.
- **Forgetting Q100's cutoff.** Id 5 is in December and would produce a negative age. `WHERE date(happened_at) <= '2024-03-04'` is what makes the answer four rows.
- **Reading the wall clock.** No exercise in this pack may use `date('now')`; results must be reproducible, and Q100 says "No wall-clock now".
- **`CAST` rounds toward zero, not to nearest.** That is correct for Q100 because every difference is already a whole number after `date()` truncation, but it is worth knowing before relying on it elsewhere.

## Try it yourself

1. Change Q094 to return the *first* day of the next month. How many modifiers do you need?
2. Write Q098 for a Sunday-start week. Which part of the `(w + 6) % 7` expression disappears?
3. Add an event on `2024-03-04 00:00:00` and say what Q100 returns for it, and why the `<=` boundary matters.
4. In words: Q092 filters with plain string comparison while Q093 calls `strftime`. Explain when each approach is preferable, and what it costs.

# Effective dated history and as of selection — sql-more Q281–Q290

**What you practise:** querying a table that keeps every version of a row with its validity period — asking "what was true on day N", detecting gaps in the history, weighting versions by how long they applied, and appending a new version without corrupting the timeline.
**Prerequisites:** [08 Temporal intervals and endpoint semantics](08-temporal-intervals-and-endpoint-semantics.md); correlated subqueries; `GROUP BY`; a first look at window functions (`LEAD`).
**Exercises:** Q281: asof-before-first-b, Q282: asof-change-boundary, Q283: asof-gap-is-absence, Q284: latest-start-carry-forward-gap, Q285: current-open-versions, Q286: detect-history-gaps, Q287: duration-weighted-window-price, Q288: orders-asof-price-join, Q289: future-scheduled-versions, Q290: atomic-close-and-append-version.

## The problem in plain words

An **effective-dated** table stores history instead of overwriting it. Rather than one row per SKU holding today's price, there is one row per *version*: the SKU, the price, and the period `[valid_from, valid_to)` during which that price applied. The current version is the one whose `valid_to` is NULL — still open, no successor yet.

Querying such a table is called an **as-of** query: pick a point in time, return the version that was in force then. Under the half-open convention of family 8 that is one predicate:

```sql
WHERE valid_from <= :asof AND (valid_to > :asof OR valid_to IS NULL)
```

Because the periods are half-open, a version ending at `4` and its successor starting at `4` hand over cleanly: at day 4 exactly one of them matches. Q282 exists to show that.

The interesting part is what the predicate does *not* do. Two situations produce no row at all, and they mean different things:

- **Before the first version.** SKU B's history starts at day 2, so an as-of query at day 1 returns nothing for B (Q281). There was no price; that is a fact, not a bug.
- **Inside a gap.** SKU B has a version ending at 6 and the next starting at 7. Day 6 falls in the hole (Q283). Strict interval membership treats that as "no price".

Whether a gap should be filled is a *policy*, not a property of the data. Q283 says absence; Q284 says carry forward — take the latest version whose `valid_from` is at or before the as-of point and ignore `valid_to` entirely. Both are defensible; the prompts state which one is wanted, and the two expected results differ by one row.

## The contract you must honour

Taken from `prompts/Q281.txt`–`Q290.txt` and `tests/Q281.cjs`–`Q290.cjs`. All ten share one seed:

```sql
CREATE TABLE prices(sku TEXT, valid_from INTEGER, valid_to INTEGER, price INTEGER,
                    PRIMARY KEY(sku, valid_from));
INSERT INTO prices VALUES('A',1,4,10),('A',4,8,12),('A',8,NULL,15),
                         ('B',2,6,7),('B',7,NULL,9);
```

| sku | valid_from | valid_to | price | note |
| --- | --- | --- | --- | --- |
| A | 1 | 4 | 10 | first version |
| A | 4 | 8 | 12 | starts exactly where the previous ends |
| A | 8 | NULL | 15 | current |
| B | 2 | 6 | 7 | starts later than A's history |
| B | 7 | NULL | 9 | leaves a gap over day 6 |

- The primary key is `(sku, valid_from)`, so a SKU cannot have two versions starting on the same day — but nothing in the schema prevents overlaps or gaps. Those are the application's responsibility, which is why Q286 exists.
- **Q288 seeds an extra table**: `CREATE TABLE orders(id INTEGER, sku TEXT, day INTEGER)` with rows `(1,'A',3),(2,'A',4),(3,'B',6),(4,'B',8)`. Order 3 falls in B's gap and order 2 falls on A's changeover day.
- Aliases: `sku, price` (Q281–Q284); `sku, valid_from, price` (Q285, Q289); `sku, gap_start, gap_end` (Q286); `sku, price_days` (Q287); `id, price` (Q288); `valid_from, valid_to, price` (Q290).
- Row counts: Q281 1, Q282 2, Q283 1, Q284 2, Q285 2, Q286 1, Q287 2, Q288 4, Q289 2, Q290 4.
- Ordering: by `sku` for the as-of queries; Q289 orders by `valid_from` then `sku`, which puts B's day-7 version *before* A's day-8 one; Q290 orders by `valid_from`; Q288 by the order id.
- Q288 expects `{"id":3,"price":null}`. A `LEFT JOIN` is required: an inner join would drop order 3 entirely and return three rows.
- Q290's final history must be four rows with the old current version closed at `10` and a new open version starting at `10`.

### SQL behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session, or established in family 8:

- `NULL > 6` is unknown, so `valid_to IS NULL` must be written out wherever an open version has to be kept.
- `MIN`/`MAX` with two arguments are scalar functions and propagate NULL, so Q287 replaces the open `valid_to` with `COALESCE(valid_to, 6)` before clipping.
- Window functions are available: `LEAD(valid_from) OVER (PARTITION BY sku ORDER BY valid_from)` returns the next row's `valid_from` within the same SKU, and NULL for the last row of each partition.
- `BEGIN` / `COMMIT` are ordinary statements to the tokenizer in `runtime.cjs`, which splits on semicolons outside quotes and comments and grades only the final statement.

## Approach

1. **Write the as-of predicate once and reuse it.** `valid_from <= :p AND (valid_to > :p OR valid_to IS NULL)`. Q281, Q282, Q283 and Q279 in the previous family are the same query with a different `p`.
2. **Read "no row" as an answer, not an error** (Q281, Q283). The result set simply has fewer SKUs in it.
3. **Switch to "latest start" when the policy is carry-forward** (Q284). A correlated subquery — `p.valid_from = (SELECT MAX(x.valid_from) FROM prices x WHERE x.sku = p.sku AND x.valid_from <= 6)` — picks one version per SKU and never consults `valid_to`, so a gap is invisible to it.
4. **Identify the current version by its open end** (Q285): `WHERE valid_to IS NULL`. That is the convention this schema uses; a `MAX(valid_from)` would give the same rows here but would also pick a *future* scheduled version, which is a different question (Q289).
5. **Compare each version with its successor using `LEAD`** (Q286). Put the window function in a CTE so the outer query can filter on its result — a window function cannot appear in a `WHERE` clause.
6. **Weight by duration with the clip-and-clamp expression from family 8, inside `SUM`** (Q287). Each version contributes `price × overlap_length`, and versions outside the window contribute `0` rather than a negative number.
7. **Use a `LEFT JOIN` for an as-of join** (Q288). The as-of predicate goes in the `ON` clause, not the `WHERE`: in `ON` it decides what counts as a match and leaves unmatched orders with a NULL price; in `WHERE` it would delete them.
8. **Express "scheduled" as `valid_from > :asof`** (Q289) — a version that has not started yet, whether or not it is open-ended.
9. **Close and append in one transaction** (Q290): `UPDATE` the open row to end at the changeover point, `INSERT` the new open row, and wrap both in `BEGIN`/`COMMIT` so no reader can observe a moment with two open versions or none.

## Worked example — Q281 asof-before-first-b

The task, quoted from `prompts/Q281.txt`: "Select prices effective at day1 under half-open intervals; B has not started."

**Step 1 — apply `valid_from <= 1`.**

| sku | valid_from | valid_to | price | `valid_from <= 1` |
| --- | --- | --- | --- | --- |
| A | 1 | 4 | 10 | true |
| A | 4 | 8 | 12 | false — dropped |
| A | 8 | NULL | 15 | false — dropped |
| B | 2 | 6 | 7 | false — dropped |
| B | 7 | NULL | 9 | false — dropped |

**Step 2 — apply `(valid_to > 1 OR valid_to IS NULL)` to the survivor.** A's first version has `valid_to = 4`, and `4 > 1` is true, so it stays.

**Step 3 — `SELECT sku, price`.**

| sku | price |
| --- | --- |
| A | 10 |

**Step 4 — what B's absence means.** B's earliest version begins on day 2. At day 1 there was no B price, so no row is returned for B — the query is not hiding anything and there is nothing to fill in. Compare Q283, where B is missing for a different reason: a *gap* between two versions rather than a history that has not begun. The predicate cannot tell those apart, and does not need to: both mean "no version was in force".

**Step 5 — `ORDER BY sku`.** One row here; the clause matters as soon as more than one SKU qualifies, as in Q282.

**The asserted result**, from `tests/Q281.cjs`:

```sql
-- [{"sku":"A","price":10}]
```

The reference solution as it now reads in `solutions/Q281.sql`:

```sql
-- Why this works:
-- An as-of query asks which version was in force at one point, which under
-- half-open validity is valid_from <= p and p < valid_to.
-- A NULL valid_to marks the still-current version, and NULL > 1 is unknown
-- rather than true, so that case is spelled out with OR valid_to IS NULL.
-- Only A's first version covers day 1. B's history does not start until day
-- 2, so B contributes no row at all, and that absence is the answer rather
-- than a missing value to fill in.
SELECT sku,
       price
FROM prices
WHERE valid_from <= 1
  AND (valid_to > 1 OR valid_to IS NULL)
ORDER BY sku;
```

**Contrast with Q284.** Asked at day 6, the strict predicate returns only A (Q283), because B is inside a gap. The carry-forward version returns both: it takes B's latest version starting at or before 6 — the one from day 2 — and reports its price of 7 even though that version formally expired at 6. Same data, same instant, two legitimate answers; the difference is entirely in the policy the prompt states.

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q281 | asof-before-first-b | as of day 1 | the literal `1` in both comparisons |
| Q282 | asof-change-boundary | as of day 4, "replacement begins exactly then" | the literal `4`; half-open handover picks the successor |
| Q283 | asof-gap-is-absence | as of day 6, "gap is not forward-filled" | the literal `6`; B drops out |
| Q284 | latest-start-carry-forward-gap | "use latest start<=6 ignoring valid_to" | correlated `MAX(valid_from)` subquery instead of the interval test |
| Q285 | current-open-versions | "rows with NULL valid_to only" | `WHERE valid_to IS NULL` |
| Q286 | detect-history-gaps | "gaps between finite valid_to and next valid_from" | CTE with `LEAD(valid_from) OVER (PARTITION BY sku ORDER BY valid_from)`, filtered `next_start > valid_to` |
| Q287 | duration-weighted-window-price | "total price-days over [2,6)" | `SUM(price * MAX(0, MIN(COALESCE(valid_to,6),6) - MAX(valid_from,2)))` grouped by SKU |
| Q288 | orders-asof-price-join | "preserving NULL price in a gap" | `LEFT JOIN prices` with the as-of predicate in `ON` |
| Q289 | future-scheduled-versions | "scheduled strictly after day6" | `WHERE valid_from > 6`, ordered by `valid_from, sku` |
| Q290 | atomic-close-and-append-version | "close … and insert … in one transaction" | `BEGIN; UPDATE ...; INSERT ...; COMMIT;` then the history select |

## Pitfalls the tests are designed to catch

- **Using `BETWEEN valid_from AND valid_to`.** That is the closed convention. At day 4 it returns *both* A versions, and the expected Q282 result has one row per SKU.
- **Forgetting `OR valid_to IS NULL`.** Every current version disappears. At day 1 the answer happens to be unchanged, which makes this bug easy to ship; at day 8 or later it returns nothing.
- **Filling the gap by accident in Q283.** Any predicate that ignores `valid_to` — including a plain `MAX(valid_from)` — brings B back with price 7. That is Q284's answer, not Q283's.
- **Using `MAX(valid_from)` as a global maximum in Q284.** The subquery must be correlated on `x.sku = p.sku`; without that it finds the latest start across all SKUs and returns at most one row.
- **Confusing "current" with "latest" in Q285 and Q289.** On this seed `valid_to IS NULL` and `MAX(valid_from)` pick the same rows, because no version is scheduled in the future. Add one and they diverge immediately — which is precisely what Q289 selects.
- **Putting the window function in `WHERE`.** `WHERE LEAD(...) > valid_to` is invalid: window functions are computed after `WHERE`. Q286 wraps it in a CTE and filters the CTE's output.
- **Reporting A's boundary as a gap in Q286.** A's versions meet exactly (`valid_to = 4`, next `valid_from = 4`), so `next_start > valid_to` is false. Using `>=` or `<>` would report a spurious gap.
- **Including the last version of each SKU in Q286.** `LEAD` returns NULL there, and `NULL > valid_to` is unknown, so those rows drop out on their own — no extra clause needed.
- **Letting the open version poison the sum in Q287.** `MIN(NULL, 6)` is NULL, and `price * NULL` is NULL, and `SUM` would then ignore that row — which happens to give the right answer for A by luck. `COALESCE(valid_to, 6)` makes the intent explicit and keeps the clamp meaningful.
- **Putting Q288's as-of predicate in `WHERE`.** Order 3 has no matching price row, so after a `LEFT JOIN` its `p` columns are NULL; a `WHERE p.valid_from <= o.day` then evaluates to unknown and deletes the row. The expected result has four rows including a null price.
- **Ordering Q289 by `sku`.** The prompt says "ordered by effective date then SKU", so B's day-7 version comes first. Ordering by SKU would put A first and fail on position.
- **Doing Q290's two writes without a transaction.** The graded rows would be identical, because nothing else is reading the database — but the prompt asks for one transaction, and between the `UPDATE` and the `INSERT` the history has no open version at all. The reviewer reads the file.
- **Closing the wrong row in Q290.** `WHERE sku='A' AND valid_to IS NULL` targets exactly the current version. A `WHERE sku='A'` alone would stamp `valid_to = 10` onto all three A rows.

## Try it yourself

1. Add a scheduled version `('A', 12, NULL, 20)`. Which of Q285 and Q289 changes, and what does that say about using `valid_to IS NULL` to mean "current"?
2. Rewrite Q284 so that it carries forward *only* across gaps shorter than two days. Where does that condition go, and does the subquery still return one row per SKU?
3. Extend Q286 to report overlaps as well as gaps. Which comparison flips, and what would an overlap in this seed look like?
4. In words: Q283 and Q284 give different prices for B on day 6. Describe a business rule that makes each one the correct answer, and say which one you would want an invoice to use.

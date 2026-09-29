# Temporal intervals and endpoint semantics — sql-more Q271–Q280

**What you practise:** writing interval predicates whose endpoint rule is deliberate — half-open or closed — and handling the two awkward rows every interval table eventually grows: the open-ended one and the empty one.
**Prerequisites:** `WHERE` with `AND`/`OR`; SQL three-valued logic (`NULL` comparisons are *unknown*, not false); self-joins.
**Exercises:** Q271: half-open-point-membership, Q272: closed-point-membership, Q273: half-open-overlap-query-window, Q274: closed-overlap-query-window, Q275: overlap-pairs-half-open, Q276: adjacent-boundaries-not-overlap, Q277: clip-to-window-duration, Q278: fully-contained-finite, Q279: open-ended-snapshot, Q280: invalid-or-empty-half-open.

## The problem in plain words

An interval is two numbers, `start` and `end`. Everything interesting follows from one question the numbers do not answer: **is `end` inside the interval or not?**

- **Half-open**, written `[start, end)`: a point `p` belongs when `start <= p < end`. Adjacent intervals `[1,4)` and `[4,7)` fit together with no gap and no overlap. This is the convention almost every booking, billing and scheduling system uses, because it composes.
- **Closed**, written `[start, end]`: `start <= p <= end`. The point `4` then belongs to both `[1,4]` and `[4,7]`, so adjacent intervals overlap by one point.

The same table is read under both conventions in this family, which is why Q271 and Q272 — the same point, the same rows — return different answers.

Two rows in the seed exist to break naive predicates:

- **Row 4 is open-ended**: `end` is NULL, meaning "still running, no known finish". A NULL end must be read as *infinity*, and SQL will not do that for you: `NULL > 4` is unknown, so `WHERE end > 4` silently drops the row. Every "still active" predicate therefore needs `OR end IS NULL`.
- **Row 5 is empty under the half-open rule**: `start` and `end` are both `6`, so `[6,6)` contains no point at all. Under the closed rule `[6,6]` contains exactly one point. Whether it should appear in an answer depends on the convention, so the prompts say which.

## The contract you must honour

Taken from `prompts/Q271.txt`–`Q280.txt` and `tests/Q271.cjs`–`Q280.cjs`. All ten share one seed:

```sql
CREATE TABLE bookings(id INTEGER PRIMARY KEY, start INTEGER, end INTEGER);
INSERT INTO bookings VALUES(1,1,4),(2,4,7),(3,3,5),(4,8,NULL),(5,6,6);
```

| id | start | end | shape |
| --- | --- | --- | --- |
| 1 | 1 | 4 | finite, ends exactly where 2 begins |
| 2 | 4 | 7 | finite, begins exactly where 1 ends |
| 3 | 3 | 5 | finite, genuinely overlaps both 1 and 2 |
| 4 | 8 | NULL | open-ended |
| 5 | 6 | 6 | empty half-open, single point when closed |

- `start` and `end` are ordinary integers, not dates. `end` is the only nullable column; `start` is never NULL in the seed, so no predicate here has to defend against that.
- Note that `end` is not a reserved word in SQLite and needs no quoting.
- Aliases: `id` (Q271–Q274, Q278, Q279, Q280); `first, second` (Q275); `before, after` (Q276); `id, duration` (Q277).
- Row counts: Q271 2, Q272 3, Q273 2, Q274 5, Q275 2, Q276 1, Q277 5, Q278 4, Q279 1, Q280 1.
- Every exercise ends in an `ORDER BY`; the two pair queries order by both columns.
- Each prompt states its own endpoint policy in words. Q271: "start<=p<end; NULL end is unbounded and empty interval excluded". Q273: "exclude merely touching endpoints". Q274: "including zero-duration point intervals". Q278: "open-ended intervals are not contained". Those sentences are the specification; the expected rows are the proof.

### SQL behaviour the expected rows depend on

Checked against SQLite 3.49.1 through `node:sqlite` in this session:

- `NULL <= 7` and `NULL > 4` both evaluate to NULL, not to 0. `WHERE` keeps only rows whose predicate is true, so an unknown drops the row. That is why Q278 excludes the open-ended row 4 without naming it, and why Q271 has to name it with `OR end IS NULL`.
- `MIN` and `MAX` with **two or more arguments** are scalar functions, not aggregates: `MAX(0,-2)` is `0` and `MIN(4,6)` is `4`. With a single argument they would be aggregates instead.
- Those scalar forms propagate NULL: `MAX(0,NULL)` is NULL. Q277 therefore has to replace the NULL *before* the arithmetic, with `COALESCE(end,6)`.
- `COALESCE(NULL,6)` returns `6` — the first non-NULL argument.

## Approach

1. **Write the convention down before writing the predicate.** "Half-open" gives `start <= p AND p < end`; "closed" gives `start <= p AND p <= end`. One character separates Q271 from Q272.
2. **Translate "still running" into `OR end IS NULL` everywhere `end` is compared.** Group it with parentheses: `AND (end > 4 OR end IS NULL)`. Without the parentheses the `OR` binds loosely and the whole predicate changes meaning.
3. **Use the standard overlap test.** Two half-open intervals `[a1,a2)` and `[b1,b2)` overlap exactly when `a1 < b2 AND b1 < a2`. For closed intervals the two strict comparisons become `<=`. Q273 and Q274 apply that to one literal window; Q275 applies it between two rows of the same table.
4. **Exclude empty intervals explicitly when the policy says "nonempty".** `(end > start OR end IS NULL)`. An open-ended interval is never empty, so it must be allowed through the same test.
5. **Express adjacency as equality, not as overlap** (Q276). `a.end = b.start` is exactly "a finishes where b starts", and under the half-open rule those two intervals do *not* overlap. Equality also excludes the NULL end automatically, since `NULL = 8` is unknown.
6. **Pair rows with a self-join and a strict `<` on the key** (Q275). `a.id < b.id` yields each unordered pair once and rules out pairing a row with itself. Q276's pairs are *ordered*, so it joins on the adjacency condition instead and does not need that guard.
7. **Clip with `MIN`/`MAX` and clamp the result** (Q277). `MIN(end, window_end) - MAX(start, window_start)` is the intersection length, negative when there is no intersection, so wrap it in `MAX(0, ...)`.
8. **Express containment as two comparisons in the right direction** (Q278): `start >= low AND end <= high`. Leaving the NULL end untreated is what makes the open-ended row fall out, which this prompt wants.

## Worked example — Q271 half-open-point-membership

The task, quoted from `prompts/Q271.txt`: "Find intervals containing point4 under start<=p<end; NULL end is unbounded and empty interval excluded."

**Step 1 — apply `start <= 4`.**

| id | start | end | `start <= 4` |
| --- | --- | --- | --- |
| 1 | 1 | 4 | true |
| 2 | 4 | 7 | true |
| 3 | 3 | 5 | true |
| 4 | 8 | NULL | false — dropped |
| 5 | 6 | 6 | false — dropped |

**Step 2 — apply `(end > 4 OR end IS NULL)` to what survives.**

| id | end | `end > 4` | `end IS NULL` | kept |
| --- | --- | --- | --- | --- |
| 1 | 4 | false | false | no |
| 2 | 7 | true | false | yes |
| 3 | 5 | true | false | yes |

Row 1 is the whole point of the half-open rule. Its interval is `[1,4)`, and the point `4` is its *exclusive* end, so it is not a member. Under the closed rule of Q272 the comparison becomes `end >= 4`, row 1 is kept, and the answer grows to three rows.

**Step 3 — the two special rows, and why the query says nothing more about them.** The prompt promises that the empty interval is excluded and the open-ended one is unbounded, but neither needs its own clause here:

- Row 5 `[6,6)` was already dropped by `start <= 4`. Had the point been `6`, the `end > 6` test would have excluded it, which is exactly what "empty interval excluded" means.
- Row 4 `[8, ∞)` was also dropped by `start <= 4`. The `OR end IS NULL` clause is still required, because at a point of `9` — Q279 — it is the only thing that keeps row 4 in.

**Step 4 — `ORDER BY id`.**

**The asserted result**, from `tests/Q271.cjs`:

```sql
-- [{"id":2},{"id":3}]
```

The reference solution as it now reads in `solutions/Q271.sql`:

```sql
-- Why this works:
-- Half-open membership means start <= p < end, so the end value itself is
-- outside the interval: booking 1 ends at 4 and does not contain 4.
-- A NULL end means still running, and SQL will not read that as infinity on
-- its own: end > 4 is unknown for a NULL, and WHERE keeps only true rows.
-- So the unbounded case is spelled out with OR end IS NULL, parenthesized
-- so it binds to the end test rather than to the whole predicate.
-- The empty interval 6..6 needs no clause of its own here: it fails
-- start <= 4, and at any other point the strict end test excludes it.
SELECT id
FROM bookings
WHERE start <= 4
  AND (end > 4 OR end IS NULL)
ORDER BY id;
```

## Policy matrix — what changes between the variants

| ID | Variant | What changes in the prompt | What changes in the SQL |
| --- | --- | --- | --- |
| Q271 | half-open-point-membership | "start<=p<end" | `start<=4 AND (end>4 OR end IS NULL)` |
| Q272 | closed-point-membership | "closed start<=p<=end" | one character: `end>=4` |
| Q273 | half-open-overlap-query-window | "overlapping [4,8); exclude touching" | `start<8 AND (end>4 OR end IS NULL)` plus a nonempty test |
| Q274 | closed-overlap-query-window | "[4,8], including zero-duration" | `start<=8 AND (end>=4 OR end IS NULL)`; no nonempty test |
| Q275 | overlap-pairs-half-open | "distinct id pairs" | self-join with `a.id<b.id` and the overlap test on both sides |
| Q276 | adjacent-boundaries-not-overlap | "finite a.end=b.start" | join on equality; both intervals must be nonempty |
| Q277 | clip-to-window-duration | "intersection length with [2,6), open end as 6" | `MAX(0, MIN(COALESCE(end,6),6) - MAX(start,2))` |
| Q278 | fully-contained-finite | "entirely contained in closed [1,7]" | `start>=1 AND end<=7`, with NULL end left to fall out |
| Q279 | open-ended-snapshot | "at point9 … NULL end unbounded" | the Q271 predicate with `9`, which now selects only the open row |
| Q280 | invalid-or-empty-half-open | "ids where end<=start; NULL end is valid" | `end<=start`, which NULL fails silently |

## Pitfalls the tests are designed to catch

- **Using `BETWEEN` for a half-open interval.** `p BETWEEN start AND end` is inclusive on both sides — it is the closed rule. It cannot express Q271.
- **Forgetting `OR end IS NULL`.** Q279's expected answer is the single open-ended row 4. Without the clause the query returns nothing at all, and the failure is silent: no error, just an empty result.
- **Writing `end != NULL` or `end <> NULL`.** Always unknown. `IS NULL` and `IS NOT NULL` are the only tests that work.
- **Losing the parentheses.** `WHERE start <= 4 AND end > 4 OR end IS NULL` parses as `(start<=4 AND end>4) OR end IS NULL`, which returns row 4 as well, at every point.
- **Treating "touching" as overlapping in Q273.** Rows 1 and the window `[4,8)` share only the boundary `4`. The half-open test `end > 4` rejects row 1; a `>=` would wrongly include it. Q274 is the variant where the boundary *does* count.
- **Omitting the nonempty test in Q273.** Row 5 `[6,6)` satisfies `start < 8` and `end > 4` but contains no point, so it must be excluded explicitly. Q274's closed reading treats `[6,6]` as a real one-point interval and keeps it — which is why that variant has no such clause.
- **Using `a.id <> b.id` in Q275.** That returns each pair twice, once in each order, and the expected result has two rows, not four. `a.id < b.id` also prevents a row from pairing with itself.
- **Expecting rows 1 and 2 to pair in Q275.** They touch at `4` and do not overlap: `b.start < a.end` is `4 < 4`, false. They are Q276's answer instead.
- **Letting the empty row match itself in Q276.** Row 5 satisfies `a.end = b.start` with `a` and `b` both being row 5, so the nonempty test `a.end > a.start` is what removes it.
- **Reaching for aggregate `MIN`/`MAX` in Q277.** With two arguments they are scalar functions; with one they aggregate over the group, which would collapse five rows into one. The two-argument form is what this query needs.
- **Letting the NULL reach the arithmetic in Q277.** `MIN(NULL,6)` is NULL, and `MAX(0,NULL)` is NULL too, so the clamp does not rescue it. `COALESCE(end,6)` has to run first; the prompt says "treating open end as 6".
- **Adding `OR end IS NULL` to Q278.** The prompt says open-ended intervals are *not* contained, so the unknown comparison doing the work is the intended behaviour, not an oversight.
- **Expecting row 4 in Q280.** `NULL <= 8` is unknown, so the open-ended row is not reported as invalid — which matches "NULL end is valid".

## Try it yourself

1. Rewrite Q272 with `BETWEEN`. Does it give the same three rows, and what does that tell you about which convention `BETWEEN` encodes?
2. Change Q277's window to `[0,10)` with the open end treated as `10`. Which row's duration changes most, and does the clamp still do anything?
3. Write the closed-interval version of Q275's pair query. Which extra pair appears, and why?
4. In words: the seed's rows 1 and 2 touch at `4`. Explain why a half-open booking system can store them both without conflict, and what a closed system would have to do instead.

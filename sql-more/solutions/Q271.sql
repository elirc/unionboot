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

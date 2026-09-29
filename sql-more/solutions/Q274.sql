-- Why this works:
-- Under the closed reading the endpoints belong to the interval, so the two
-- strict comparisons of the half-open overlap test relax to <= and >=.
-- Booking 1 now qualifies because it shares the single point 4 with the
-- window, and booking 4 qualifies because it starts exactly at 8.
-- A zero-duration booking is a real one-point interval when the ends are
-- closed, so booking 5 is kept and no nonempty test appears.
-- The NULL end is still spelled out, since end >= 4 would be unknown.
SELECT id
FROM bookings
WHERE start <= 8
  AND (end >= 4 OR end IS NULL)
ORDER BY id;

-- Why this works:
-- The length of an intersection is the later of the two starts subtracted
-- from the earlier of the two ends, so MAX(start,2) and MIN(end,6) clip the
-- booking to the window.
-- MIN and MAX with two arguments are scalar functions, not aggregates, so
-- this stays one row per booking.
-- They propagate NULL, so the open end is replaced first with COALESCE,
-- which is what the prompt means by treating the open end as 6.
-- When a booking lies outside the window the subtraction is negative, so
-- the outer MAX(0,...) clamps it to zero rather than reporting a negative
-- duration.
SELECT id,
       MAX(0, MIN(COALESCE(end, 6), 6) - MAX(start, 2)) AS duration
FROM bookings
ORDER BY id;

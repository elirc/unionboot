-- Why this works:
-- This is the half-open membership predicate again, asked at a point beyond
-- every finite booking.
-- All four finite bookings end at or before 7, so end > 9 is false for each
-- of them.
-- Only the open-ended booking survives, and it survives solely because of
-- the OR end IS NULL clause: without it the query would return no rows and
-- give no hint that anything was wrong.
-- start <= 9 still applies, so a booking starting after the point would not
-- be reported as active.
SELECT id
FROM bookings
WHERE start <= 9
  AND (end > 9 OR end IS NULL)
ORDER BY id;

-- Why this works:
-- Closed membership means start <= p <= end, so the end value is inside the
-- interval and booking 1, which ends at 4, now contains the point 4.
-- That single character is the whole difference from the half-open
-- scenario, and it changes the answer from two rows to three.
-- The NULL end still has to be named explicitly, because end >= 4 is
-- unknown rather than true for an open-ended booking.
-- Bookings 4 and 5 both start after the point and fail start <= 4.
SELECT id
FROM bookings
WHERE start <= 4
  AND (end >= 4 OR end IS NULL)
ORDER BY id;

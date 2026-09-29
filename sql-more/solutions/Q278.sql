-- Why this works:
-- Containment is two comparisons pointing inward: the booking must start no
-- earlier than the window and end no later.
-- The window is closed, so both comparisons are inclusive, and booking 2
-- ending exactly at 7 is contained.
-- The open-ended booking is excluded without a clause of its own: NULL <= 7
-- is unknown, and WHERE keeps only rows whose predicate is true.
-- That silent exclusion is the intended policy here, since an interval with
-- no known end cannot be inside a finite window.
SELECT id
FROM bookings
WHERE start >= 1
  AND end <= 7
ORDER BY id;

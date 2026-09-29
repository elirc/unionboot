-- Why this works:
-- Two half-open intervals overlap exactly when each starts before the other
-- ends, which here is start < 8 against the window end and end > 4 against
-- the window start.
-- Both comparisons are strict, so an interval that merely touches the
-- window boundary is excluded: booking 1 ends at 4 and shares no point
-- with the window.
-- An open-ended booking can never be ruled out by the end test, so the
-- NULL case is allowed through both that test and the nonempty test.
-- The nonempty test removes booking 5, whose 6..6 range contains no point
-- at all under a half-open reading.
SELECT id
FROM bookings
WHERE start < 8
  AND (end > 4 OR end IS NULL)
  AND (end > start OR end IS NULL)
ORDER BY id;

-- Why this works:
-- Under a nonempty half-open policy a booking is valid when end is strictly
-- greater than start, so the invalid ones are exactly those with
-- end <= start.
-- Booking 5 runs from 6 to 6, an interval containing no point, and is the
-- only finite row that fails.
-- The open-ended booking is valid by definition, and it drops out on its
-- own: NULL <= 8 is unknown, so the row is not reported.
-- No IS NULL clause is therefore needed here, which is the opposite of the
-- membership scenarios.
SELECT id
FROM bookings
WHERE end <= start
ORDER BY id;

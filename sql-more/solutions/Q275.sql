-- Why this works:
-- Pairs come from joining the table to itself, and a.id < b.id yields each
-- unordered pair exactly once while also preventing a row pairing with
-- itself.
-- The overlap rule is applied between the two rows: each must start before
-- the other ends, with both comparisons strict so that merely touching
-- bookings such as 1 and 2 are not reported.
-- A NULL end means the interval runs forever, so every comparison against
-- it is replaced by an IS NULL alternative rather than dropped.
-- Both intervals must be nonempty, which is what excludes booking 5.
SELECT a.id AS first,
       b.id AS second
FROM bookings a
JOIN bookings b
  ON a.id < b.id
 AND (a.end > a.start OR a.end IS NULL)
 AND (b.end > b.start OR b.end IS NULL)
 AND (a.start < b.end OR b.end IS NULL)
 AND (b.start < a.end OR a.end IS NULL)
ORDER BY a.id,
         b.id;

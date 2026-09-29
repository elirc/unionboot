-- Why this works:
-- Adjacency is equality, not overlap: a finishes exactly where b starts, so
-- the join condition is a.end = b.start.
-- Under a half-open reading such a pair shares no point, which is why these
-- rows are absent from the overlap scenario and present here.
-- The pairs are ordered rather than unordered, so no a.id < b.id guard is
-- wanted; what is needed is that both intervals are nonempty.
-- a.end > a.start also removes the self-match of booking 5, whose end and
-- start are both 6.
-- An open-ended booking cannot be the earlier half, because NULL = b.start
-- is never true.
SELECT a.id AS before,
       b.id AS after
FROM bookings a
JOIN bookings b ON a.end = b.start
WHERE a.end > a.start
  AND (b.end > b.start OR b.end IS NULL)
ORDER BY a.id,
         b.id;

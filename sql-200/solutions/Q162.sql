-- Why this works:
-- A recursive CTE builds rows that are not in any table. The first arm
-- seeds it with the lowest and highest visit day; the second arm adds one
-- to day and carries last_day forward until day reaches it.
-- UNION ALL is used rather than UNION: SQLite accepts either, but UNION
-- would deduplicate on every step, and the generator already produces each
-- day exactly once.
-- WHERE day<span.last_day is the termination condition; without it the
-- recursion would not stop.
-- The outer query then keeps the generated days that have no matching visit.
WITH RECURSIVE span(day, last_day) AS (
  SELECT MIN(day), MAX(day) FROM visits
  UNION ALL
  SELECT day + 1, span.last_day FROM span WHERE day < span.last_day
)
SELECT day AS missing
FROM span s
WHERE NOT EXISTS (SELECT 1 FROM visits v WHERE v.day = s.day)
ORDER BY missing;

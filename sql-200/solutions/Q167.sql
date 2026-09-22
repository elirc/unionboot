-- Why this works:
-- LAG is LEAD's mirror: it reads the previous row in the window's order.
-- level>LAG(level) is a strict comparison, so an equal reading (ids 4 and
-- 7) is not rising and gets 0.
-- The first row has no predecessor, so LAG is NULL, the comparison is
-- unknown rather than true, and the CASE falls through to ELSE 0. That is
-- exactly the required "first row is 0" rule, with no special case.
SELECT id,
       CASE WHEN level > LAG(level) OVER (ORDER BY id) THEN 1 ELSE 0 END AS flag
FROM battery
ORDER BY id;

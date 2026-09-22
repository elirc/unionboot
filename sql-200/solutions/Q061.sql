-- Why this works:
-- The CTE is an ordinary named subquery, not a recursive one: it aggregates
-- staff by manager_id once, and the main query then reads it as a table.
-- WHERE manager_id IS NOT NULL keeps the root out of the counts; Ada reports
-- to nobody, so she is nobody's direct report.
-- Joining counts back to staff turns a manager id into a manager name.
-- The threshold is a plain WHERE in the main query, because by then reports
-- is a column of a finished table rather than an aggregate needing HAVING.
WITH counts AS (
  SELECT manager_id,
         COUNT(*) AS reports
  FROM staff
  WHERE manager_id IS NOT NULL
  GROUP BY manager_id
)
SELECT s.name,
       c.reports
FROM counts c
JOIN staff s ON s.id = c.manager_id
WHERE c.reports >= 2
ORDER BY s.id;

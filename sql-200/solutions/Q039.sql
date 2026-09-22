-- Why this works:
-- The correlated subquery sits in the select list rather than in WHERE, so it
-- produces a number for every employee and none are filtered out; all six
-- rows must appear.
-- COUNT(*) over zero matching rows is 0, never NULL, which is how the top
-- earner of each department reports 0.
-- Flo's salary is NULL, so x.salary > e.salary is unknown for every colleague
-- and no row matches: unknown compares to nothing, producing zero exactly as
-- the prompt states.
SELECT e.name,
       (SELECT COUNT(*)
        FROM employees x
        WHERE x.dept = e.dept
          AND x.salary > e.salary) AS higher
FROM employees e
ORDER BY e.id;

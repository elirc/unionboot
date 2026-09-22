-- Why this works:
-- NOT EXISTS is the NULL-safe way to ask "no matching row". The bonuses row
-- with employee_id NULL simply fails the correlation and is ignored.
-- The tempting NOT IN form would break: the value list contains NULL, so
-- id <> NULL is unknown for every candidate and the query returns no rows at
-- all. The prompt calls this out directly.
-- Bo, Eli and Flo have no bonus row, so the subquery produces nothing for
-- them and the negation is true.
SELECT e.name
FROM employees e
WHERE NOT EXISTS (SELECT 1
                  FROM bonuses b
                  WHERE b.employee_id = e.id)
ORDER BY e.id;

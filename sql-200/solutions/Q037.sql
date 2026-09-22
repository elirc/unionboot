-- Why this works:
-- A correlated scalar aggregate is a subquery that returns exactly one value
-- per outer row: here, that employee's bonus total.
-- It appears twice, once in SELECT to report the sum and once in WHERE to
-- test it, because a select-list alias is not visible to WHERE.
-- Employees with no bonus row get SUM over nothing, which is NULL, and
-- NULL >= 15 is unknown, so they are filtered out without an explicit test.
-- Ada's two rows sum to 15 and Dee's single row is 20; Cy's 0 fails.
SELECT e.name,
       (SELECT SUM(b.amount) FROM bonuses b WHERE b.employee_id = e.id) AS bonus
FROM employees e
WHERE (SELECT SUM(b.amount) FROM bonuses b WHERE b.employee_id = e.id) >= 15
ORDER BY e.id;

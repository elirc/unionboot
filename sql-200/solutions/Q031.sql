-- Why this works:
-- The subquery mentions no column of the outer query, so it is uncorrelated:
-- one value, 82, computed once and compared against every row.
-- AVG ignores NULL inputs, so the divisor is 5 known salaries, not 6 rows.
-- Flo's salary is NULL, and NULL > 82 is unknown rather than false, so the
-- WHERE clause drops Flo without any explicit IS NOT NULL test.
-- ORDER BY id gives the graded order.
SELECT name,
       salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY id;

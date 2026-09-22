-- Why this works:
-- Adding WHERE x.dept = e.dept makes the subquery correlated: it now depends
-- on the outer row, so the threshold changes per department.
-- Two aliases are essential. e is the row being tested, x is the inner scan;
-- reusing one name would compare a column to itself and quietly collapse back
-- to the global average.
-- Department A averages 86.67 and B averages 75, so Ada and Dee still qualify
-- while Bo and Cy now fail against a higher bar than the global 82.
-- Department C averages NULL, and NULL > NULL is unknown, so Flo is dropped.
SELECT e.name,
       e.salary
FROM employees e
WHERE e.salary > (SELECT AVG(x.salary)
                  FROM employees x
                  WHERE x.dept = e.dept)
ORDER BY e.id;

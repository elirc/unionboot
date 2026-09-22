-- Why this works:
-- "Every known-salary employee has a bonus" is relational division, written
-- as a double negative: there is no known-salary employee in this department
-- who has no bonus record.
-- The inner NOT EXISTS finds the counterexample, the outer NOT EXISTS demands
-- that none exists.
-- The leading EXISTS blocks vacuous truth. Department C holds only Flo, whose
-- salary is unknown, so it has no known-salary employee and would otherwise
-- qualify trivially; the guard requires at least one.
-- Department A fails because Bo has no bonus row; department B passes because
-- this scenario seeds an extra bonus for Eli.
SELECT DISTINCT e.dept
FROM employees e
WHERE EXISTS (SELECT 1
              FROM employees k
              WHERE k.dept = e.dept
                AND k.salary IS NOT NULL)
  AND NOT EXISTS (SELECT 1
                  FROM employees x
                  WHERE x.dept = e.dept
                    AND x.salary IS NOT NULL
                    AND NOT EXISTS (SELECT 1
                                    FROM bonuses b
                                    WHERE b.employee_id = x.id))
ORDER BY e.dept;

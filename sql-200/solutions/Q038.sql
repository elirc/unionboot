-- Why this works:
-- "Nobody earns more" is expressed as the absence of a counterexample, so the
-- predicate is NOT EXISTS over colleagues with a strictly higher salary.
-- The strict > means ties do not disqualify anyone: two employees sharing the
-- top salary of a department would both be returned.
-- The explicit e.salary IS NOT NULL guard is required by the prompt's
-- "known-salary" wording. Without it Flo would pass, because x.salary > NULL
-- is unknown for every colleague and so no counterexample can be found.
SELECT e.name
FROM employees e
WHERE e.salary IS NOT NULL
  AND NOT EXISTS (SELECT 1
                  FROM employees x
                  WHERE x.dept = e.dept
                    AND x.salary > e.salary)
ORDER BY e.id;

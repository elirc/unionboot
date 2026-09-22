-- Why this works:
-- The subquery aggregates first and returns the owners to delete, then the
-- DELETE removes every task belonging to them - not just the rows that were
-- below the threshold.
-- HAVING filters groups after SUM, so it can refer to the aggregate.
-- SUM(points) ignores NULLs, and for Dee every value is NULL, so the sum is
-- NULL, not 0. NULL<3 is unknown, so Dee's group is not selected and task 6
-- survives. Bo's total of 2 is below 3 and task 3 is deleted.
DELETE FROM tasks
 WHERE owner IN (SELECT owner
                   FROM tasks
                  GROUP BY owner
                 HAVING SUM(points) < 3);
SELECT id, owner
FROM tasks
ORDER BY id;

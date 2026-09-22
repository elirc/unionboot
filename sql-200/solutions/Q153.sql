-- Why this works:
-- The SET expression is a correlated scalar subquery: for each task it
-- looks up that owner's delta.
-- Without the WHERE guard, owners with no adjustment row would get a
-- subquery result of NULL and have their points overwritten with NULL. The
-- EXISTS guard restricts the UPDATE to owners that do have an adjustment.
-- Task 6 keeps its NULL points because Dee has no adjustment; task 5's
-- 1 + (-1) is 0, which is a real value, not a missing one.
UPDATE tasks
   SET points = points + (SELECT delta
                            FROM adjustments a
                           WHERE a.owner = tasks.owner)
 WHERE EXISTS (SELECT 1
                 FROM adjustments a
                WHERE a.owner = tasks.owner);
SELECT id, points
FROM tasks
ORDER BY id;

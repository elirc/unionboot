-- Why this works:
-- Two conditions: the task must be open, and its owner must not appear in
-- blocked.
-- NOT EXISTS is the safe way to say that. NOT IN (SELECT owner FROM blocked)
-- would be unknown for every row because blocked contains a NULL, so no row
-- would be updated at all.
-- COALESCE(points,0) turns task 6's missing points into 0 before adding 10;
-- NULL+10 would stay NULL.
UPDATE tasks
   SET points = COALESCE(points, 0) + 10
 WHERE status = 'open'
   AND NOT EXISTS (SELECT 1
                     FROM blocked b
                    WHERE b.owner = tasks.owner);
SELECT id, points
FROM tasks
ORDER BY id;

-- Why this works:
-- The target row is chosen by an ordered subquery: highest points first,
-- then lowest id, then LIMIT 1.
-- Comparing id with that single value updates exactly one row. A filter
-- like WHERE points=(SELECT MAX(points) ...) would update every row tied at
-- the maximum.
-- The tiebreak matters because ORDER BY points DESC alone leaves ties in an
-- unspecified order; task 4 has 4 points and wins outright here, but the
-- id key makes the choice deterministic in general.
UPDATE tasks
   SET status = 'urgent'
 WHERE id = (SELECT id
               FROM tasks
              WHERE status = 'open'
              ORDER BY points DESC, id
              LIMIT 1);
SELECT id, status
FROM tasks
ORDER BY id;

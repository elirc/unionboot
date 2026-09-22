-- Why this works:
-- IN compares the owner against the set of values the subquery returns.
-- blocked holds 'Bo' and a NULL. 'Bo' IN (...) is true, so Bo's tasks are
-- cancelled.
-- For every other owner the comparison against 'Bo' is false and the
-- comparison against NULL is unknown, so the whole IN is unknown, not true,
-- and the row is not updated. Unknown behaves like false in a WHERE clause,
-- which is why the NULL does no damage here - unlike NOT IN, where it would
-- match nothing at all.
UPDATE tasks
   SET status = 'cancelled'
 WHERE owner IN (SELECT owner FROM blocked);
SELECT id, status
FROM tasks
ORDER BY id;

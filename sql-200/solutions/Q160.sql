-- Why this works:
-- RETURNING makes the UPDATE itself the final, graded statement: it emits
-- the rows it changed, with the new values, so no follow-up SELECT is
-- needed.
-- The columns named in RETURNING refer to the row after the update, which
-- is why points is 9 and not 2.
-- Exactly one row is matched on purpose. SQLite does not specify the order
-- of multi-row RETURNING output and RETURNING accepts no ORDER BY, so a
-- multi-row version could not be graded on exact order.
UPDATE tasks
   SET points = points + 7
 WHERE id = 3
RETURNING id, points;

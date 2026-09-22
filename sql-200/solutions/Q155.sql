-- Why this works:
-- A plain equality filter on the status column; no subquery is needed
-- because the rule mentions no other table.
-- = uses BINARY collation, so 'Done' would not match 'done'.
-- The two done rows, ids 2 and 5, are removed and the graded SELECT reports
-- the four survivors in id order.
DELETE FROM tasks
 WHERE status = 'done';
SELECT id, status
FROM tasks
ORDER BY id;

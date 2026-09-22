-- Why this works:
-- EXISTS asks only whether the correlated subquery returns at least one
-- row; the selected value is irrelevant, which is why it is the constant 1.
-- The subquery is correlated: b.owner=tasks.owner refers to the row the
-- DELETE is currently considering, so it is re-evaluated per row.
-- The NULL row in blocked never satisfies b.owner=tasks.owner, because
-- NULL='Ada' is unknown, so only Bo's task 3 is deleted.
DELETE FROM tasks
 WHERE EXISTS (SELECT 1
                 FROM blocked b
                WHERE b.owner = tasks.owner);
SELECT id, owner
FROM tasks
ORDER BY id;

-- Why this works:
-- NOT EXISTS is the anti-join: keep the row only when the correlated lookup
-- finds nothing.
-- adjustments holds Ada and Cy, so Bo's and Dee's tasks are deleted and the
-- four Ada/Cy rows remain.
-- Unlike NOT IN, NOT EXISTS is not derailed by NULLs in the probed table,
-- because it asks about the presence of a row rather than comparing values.
DELETE FROM tasks
 WHERE NOT EXISTS (SELECT 1
                     FROM adjustments a
                    WHERE a.owner = tasks.owner);
SELECT id, owner
FROM tasks
ORDER BY id;

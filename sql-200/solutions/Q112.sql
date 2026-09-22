-- Why this works:
-- A simple CASE names the operand once and compares it with = against each
-- WHEN value, so CASE status WHEN 'open' is status = 'open'.
-- 'pending' matches no branch and falls through to ELSE 'waiting'.
-- The comparison uses the column's collation, BINARY here, so 'Open' would
-- not match 'open'.
-- A NULL status would also fall to ELSE, because NULL = 'open' is NULL.
SELECT id,
       CASE status
         WHEN 'open' THEN 'todo'
         WHEN 'closed' THEN 'done'
         ELSE 'waiting'
       END AS label
FROM tickets
ORDER BY id;

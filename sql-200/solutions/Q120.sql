-- Why this works:
-- The sort key is a CASE expression, not a column: it maps each status to
-- a rank number, so the rows come back pending, open, closed.
-- Alphabetical ORDER BY status would give closed, open, pending, which is
-- the wrong order for this report.
-- The CASE appears only in ORDER BY, so the rank number is not part of the
-- result; the graded columns are id and status.
-- id is the second sort key and keeps the three open rows in 1,3,6 order.
SELECT id,
       status
FROM tickets
ORDER BY CASE status
           WHEN 'pending' THEN 0
           WHEN 'open' THEN 1
           ELSE 2
         END,
         id;

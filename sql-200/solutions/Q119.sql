-- Why this works:
-- The numerator is a conditional count of closed tickets; the denominator
-- is COUNT(*), every status in the group.
-- The literal 100.0 forces floating-point arithmetic. With 100 instead,
-- SQLite would divide two integers and truncate 100*1/3 to 33.
-- ROUND(x,1) then produces 33.3 for both teams, each of which has 1 closed
-- ticket out of 3.
SELECT team,
       ROUND(100.0 * SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) / COUNT(*), 1) AS closed_percent
FROM tickets
GROUP BY team
ORDER BY team;

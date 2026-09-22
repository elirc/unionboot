-- Why this works:
-- HAVING filters whole groups after aggregation, unlike WHERE, which
-- filters rows before it. A WHERE status='open' here would also shrink
-- COUNT(*) and report 2 instead of 3 for team A.
-- The HAVING condition is a conditional aggregate: it counts only the open
-- rows of the group, while the reported COUNT(*) still counts them all.
-- Team A has 2 open tickets and is kept; team B has 1 and is dropped.
SELECT team,
       COUNT(*) AS tickets
FROM tickets
GROUP BY team
HAVING SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) >= 2
ORDER BY team;

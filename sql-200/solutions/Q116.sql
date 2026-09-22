-- Why this works:
-- The weights live in a simple CASE over priority, so each row is turned
-- into points before the aggregate sees it.
-- ELSE 0 covers ticket 5's NULL priority: a NULL contribution would be
-- skipped by SUM here, but the explicit 0 keeps the rule visible and would
-- still be correct if a team had only unknown priorities.
-- Hours are ignored on purpose; the score depends on priority alone.
SELECT team,
       SUM(CASE priority
             WHEN 1 THEN 5
             WHEN 2 THEN 2
             WHEN 3 THEN 1
             ELSE 0
           END) AS points
FROM tickets
GROUP BY team
ORDER BY team;

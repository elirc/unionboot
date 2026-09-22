SELECT team,COUNT(*) AS tickets FROM tickets GROUP BY team HAVING SUM(CASE WHEN status='open' THEN 1 ELSE 0 END)>=2 ORDER BY team;

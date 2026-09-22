SELECT team,ROUND(100.0*SUM(CASE WHEN status='closed' THEN 1 ELSE 0 END)/COUNT(*),1) AS closed_percent FROM tickets GROUP BY team ORDER BY team;

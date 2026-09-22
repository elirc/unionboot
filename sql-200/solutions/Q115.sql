SELECT team,AVG(CASE WHEN status='open' THEN hours END) AS average_open FROM tickets GROUP BY team ORDER BY team;

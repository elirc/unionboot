SELECT t.label,COUNT(p.id) AS members FROM teams t LEFT JOIN people p ON t.id=p.team_id GROUP BY t.id,t.label ORDER BY t.id;

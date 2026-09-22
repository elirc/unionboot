SELECT t.label,p.name FROM teams t LEFT JOIN people p ON p.team_id=t.id ORDER BY t.id,p.id;

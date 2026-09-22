SELECT p.name,t.label FROM people p LEFT JOIN teams t ON t.id=p.team_id ORDER BY p.id;

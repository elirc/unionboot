SELECT p.name FROM people p LEFT JOIN teams t ON t.id=p.team_id WHERE t.id IS NULL ORDER BY p.id;

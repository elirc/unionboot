SELECT p.name,t.label FROM people p JOIN teams t ON t.id=p.team_id ORDER BY p.id;

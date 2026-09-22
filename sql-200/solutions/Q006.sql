SELECT p.name,t.label FROM people p LEFT JOIN teams t ON t.id=p.team_id WHERE t.label='Blue' ORDER BY p.id;

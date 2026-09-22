SELECT p.name,t.label FROM people p LEFT JOIN teams t ON t.id=p.team_id
UNION ALL SELECT p.name,t.label FROM teams t LEFT JOIN people p ON p.team_id=t.id WHERE p.id IS NULL
ORDER BY label,name;

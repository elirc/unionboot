SELECT a.name AS first,b.name AS second FROM people a JOIN people b ON a.team_id=b.team_id AND a.id<b.id ORDER BY a.id,b.id;

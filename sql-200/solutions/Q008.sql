SELECT p.name,t.label FROM people p CROSS JOIN teams t WHERE p.id<=2 AND t.id>=20 ORDER BY p.id,t.id;

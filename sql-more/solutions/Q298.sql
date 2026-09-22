DELETE FROM required;SELECT c.name FROM candidates c WHERE NOT EXISTS(SELECT 1 FROM required r WHERE NOT EXISTS(SELECT 1 FROM skills s WHERE s.name=c.name AND s.skill=r.skill)) ORDER BY c.name;

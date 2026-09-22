SELECT c.name FROM candidates c WHERE EXISTS(SELECT 1 FROM skills s WHERE s.name=c.name) AND NOT EXISTS(SELECT 1 FROM skills s WHERE s.name=c.name AND s.level<2) ORDER BY c.name;

SELECT c.name FROM candidates c WHERE (SELECT COUNT(*) FROM required r WHERE NOT EXISTS(SELECT 1 FROM skills s WHERE s.name=c.name AND s.skill=r.skill AND s.level>=r.min_level))<=1 ORDER BY c.name;

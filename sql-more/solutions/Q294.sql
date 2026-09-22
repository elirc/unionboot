SELECT c.name FROM candidates c WHERE NOT EXISTS(SELECT 1 FROM required r JOIN skills s ON s.skill=r.skill AND s.level>=r.min_level WHERE s.name=c.name) ORDER BY c.name;

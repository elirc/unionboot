SELECT c.name,r.skill FROM candidates c CROSS JOIN required r WHERE NOT EXISTS(SELECT 1 FROM skills s WHERE s.name=c.name AND s.skill=r.skill AND s.level>=r.min_level) ORDER BY c.name,r.skill;

-- Why this works:
-- This is the anti-join pattern: LEFT JOIN first so every person survives,
-- then keep only the rows where the right side stayed empty.
-- t.id IS NULL is true exactly when no team satisfied the ON condition, which
-- covers both reasons for failure: Dee's NULL team_id and Eli's team_id 99,
-- which points at a team that does not exist.
-- team_id is a plain INTEGER with no REFERENCES clause, so foreign_keys=ON
-- does not stop that dangling value from being stored.
SELECT p.name
FROM people p
LEFT JOIN teams t ON t.id = p.team_id
WHERE t.id IS NULL
ORDER BY p.id;

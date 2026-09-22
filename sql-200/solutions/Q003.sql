-- Why this works:
-- The requirement is "every team", so teams must be the preserved side and
-- therefore the left table of the LEFT JOIN.
-- Blue matches two people and produces two rows, Gold matches one, and Red
-- matches none so it appears once with name NULL.
-- Eli and Dee never appear: people is the optional side here.
-- ORDER BY t.id,p.id sorts teams first and then members within a team; the
-- single NULL name sorts first inside its own team but that team has no peer.
SELECT t.label,
       p.name
FROM teams t
LEFT JOIN people p ON p.team_id = t.id
ORDER BY t.id, p.id;

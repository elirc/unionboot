-- Why this works:
-- A full outer join is the union of "every left row" and "every right row".
-- The first branch is a LEFT JOIN from people, giving all five people.
-- The second branch mirrors the join from teams and keeps only the teams that
-- matched nobody, detected by p.id IS NULL after the outer join.
-- UNION ALL concatenates without removing duplicates, so a repeated
-- name/label pair would still be reported once per source row.
-- ORDER BY label,name applies to the whole compound; SQLite sorts NULL first
-- in ascending order, which is why the two team-less people head the result.
SELECT p.name,
       t.label
FROM people p
LEFT JOIN teams t ON t.id = p.team_id
UNION ALL
SELECT p.name,
       t.label
FROM teams t
LEFT JOIN people p ON p.team_id = t.id
WHERE p.id IS NULL
ORDER BY label, name;

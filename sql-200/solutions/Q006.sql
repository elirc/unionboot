-- Why this works:
-- WHERE runs after the join has been formed, on rows that already carry the
-- NULL padding a LEFT JOIN adds for unmatched people.
-- t.label = 'Blue' is unknown for every NULL-padded row, and WHERE keeps only
-- rows that are true, so Cy, Dee and Eli are discarded.
-- The net effect is an inner join: the LEFT keyword no longer changes the
-- answer, which is the lesson this scenario is built to show.
SELECT p.name,
       t.label
FROM people p
LEFT JOIN teams t ON t.id = p.team_id
WHERE t.label = 'Blue'
ORDER BY p.id;

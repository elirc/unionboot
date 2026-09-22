-- Why this works:
-- The Blue restriction sits in ON, so it narrows what counts as a match
-- rather than filtering the joined result.
-- Every person still survives because the join is LEFT: Cy's Gold team fails
-- the ON condition and is simply not matched, so Cy keeps a NULL label
-- exactly like Dee and Eli.
-- Compare Q006, where the same predicate in WHERE deletes those rows.
SELECT p.name,
       t.label
FROM people p
LEFT JOIN teams t ON t.id = p.team_id AND t.label = 'Blue'
ORDER BY p.id;

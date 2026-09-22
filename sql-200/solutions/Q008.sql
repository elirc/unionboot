-- Why this works:
-- CROSS JOIN has no ON clause: it pairs every surviving person with every
-- surviving team, so the row count is the product of the two filtered sets.
-- The two range limits are ordinary row filters, not match conditions, so
-- they belong in WHERE: people 1 and 2, teams 20 and 30, giving 2 * 2 rows.
-- This builds candidate assignments that do not exist yet, which is why no
-- relationship column is consulted at all.
SELECT p.name,
       t.label
FROM people p
CROSS JOIN teams t
WHERE p.id <= 2
  AND t.id >= 20
ORDER BY p.id, t.id;

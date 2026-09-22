-- Why this works:
-- HAVING COUNT(*)>1 keeps only the groups that have more than one member,
-- which is the definition of a duplicate.
-- The WHERE clause runs before grouping and removes the NULL email, so it
-- never forms a group; a HAVING test could not do that job as cleanly,
-- since the NULL group has only one member anyway.
-- Counting after lower() means 'CY@x.com' would join 'cy@x.com' if a second
-- cy row existed; here the duplicates are ada and dee.
SELECT lower(email) AS email,
       COUNT(*) AS copies
FROM raw
WHERE email IS NOT NULL
GROUP BY lower(email)
HAVING COUNT(*) > 1
ORDER BY email;

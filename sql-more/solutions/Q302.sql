-- Why this works:
-- This is Q301 with the two tables swapped: it lists the keys a full mirror
-- would have to delete, because they exist locally and not remotely.
-- Driving from local makes local the outer table; NOT EXISTS probes remote
-- once per local row and keeps the rows with no match.
-- Only key presence is compared, so key C (NULL on both sides) is rejected
-- on the key test alone and never reaches a value comparison.
-- ORDER BY l.key fixes the graded row order.
SELECT l.key,
       l.value
FROM local l
WHERE NOT EXISTS (SELECT 1 FROM remote r WHERE r.key = l.key)
ORDER BY l.key;

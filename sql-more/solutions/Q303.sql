-- Why this works:
-- An inner join on key keeps only the three shared keys A, B and C.
-- IS NOT is SQLite's null-safe inequality: it always yields 0 or 1, never
-- NULL. 20 IS NOT 25 is true; NULL IS NOT NULL is false. Plain <> would
-- evaluate to NULL for key C, and the WHERE clause treats NULL as false, so
-- the row would be dropped for the wrong reason.
-- Only key B survives, which is the single expected row.
-- The two value columns need explicit aliases: after USING(key) both tables
-- still expose a column called value, and the graded shape is
-- key, old_value, new_value.
SELECT l.key,
       l.value AS old_value,
       r.value AS new_value
FROM local l
JOIN remote r USING(key)
WHERE l.value IS NOT r.value
ORDER BY l.key;

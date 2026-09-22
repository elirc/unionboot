-- Why this works:
-- COALESCE returns its first argument that is not NULL, so a known value
-- passes through untouched and an unknown one becomes -1.
-- The test it applies is strictly "is this NULL", not "is this falsy": row 5
-- holds the value 0, which is a perfectly good number, so it is returned as
-- 0 rather than being replaced.
-- No WHERE clause, because every row must appear in the output.
SELECT id,
       COALESCE(a, -1) AS value
FROM measures
ORDER BY id;

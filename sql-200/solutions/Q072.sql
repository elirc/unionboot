-- Why this works:
-- UNION ALL is plain concatenation: no comparison, no deduplication, so all
-- five spring rows and all four autumn rows survive as nine.
-- That means three NULL rows and three Bo rows, where UNION collapsed each
-- group to one.
-- It is also the cheaper operator, because it never has to sort or hash the
-- rows to find duplicates.
-- The single trailing ORDER BY sorts the whole compound, NULLs first.
SELECT name FROM spring
UNION ALL
SELECT name FROM autumn
ORDER BY name;

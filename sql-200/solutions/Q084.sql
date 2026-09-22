-- Why this works:
-- a <> 5 is true for 10, 0 and 3, false for 5, and unknown for the two rows
-- where a is NULL.
-- WHERE keeps only rows whose predicate is true, so unknown behaves like
-- false here and the NULL rows are excluded.
-- That means a=5 and a<>5 do not partition the table: one row plus three
-- rows is four, not six. The missing two are the unknowns.
SELECT id
FROM measures
WHERE a <> 5
ORDER BY id;

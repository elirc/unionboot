-- Why this works:
-- json_array_length counts the elements at a path without expanding them, so
-- one basket stays one row and no join is needed.
-- Duplicates count separately: basket 1 holds red twice and reports 3.
-- An empty array is still an array, so basket 2 reports 0 rather than NULL
-- or disappearing, which is what the prompt means by preserving empty
-- arrays as zero.
-- ORDER BY id fixes the row order the exact comparison depends on.
SELECT id,
       json_array_length(body, '$.tags') AS tags
FROM baskets
ORDER BY id;

-- Why this works:
-- NOT IN needs guarding at both ends when NULLs are in play.
-- The subquery filters out excluded's NULL row. Without that, the value list
-- would contain a NULL, every NOT IN test would evaluate to unknown, and the
-- query would return nothing at all.
-- a IS NOT NULL guards the left side, because NULL NOT IN (5) is also
-- unknown; the prompt asks for known values only.
-- What is left is the a values 10, 0 and 3, with 5 removed by the list.
SELECT id,
       a
FROM measures
WHERE a IS NOT NULL
  AND a NOT IN (SELECT value
                FROM excluded
                WHERE value IS NOT NULL)
ORDER BY id;

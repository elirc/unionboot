-- Why this works:
-- "Second distinct score level" is DENSE_RANK = 2, not the second row.
-- In team A the second level is 90, shared by Bo and Cy, so both are
-- returned. In team B the second level is 60, held by Gus, who is the third
-- row by position; ROW_NUMBER = 2 would have returned Flo instead.
-- A team with only one distinct score would produce no row at all, since no
-- row would carry level 2.
WITH r AS (
  SELECT *,
         DENSE_RANK() OVER (PARTITION BY team ORDER BY score DESC) AS n
  FROM scores
)
SELECT team,
       name,
       score
FROM r
WHERE n = 2
ORDER BY team, id;

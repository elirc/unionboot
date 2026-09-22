-- Why this works:
-- "At most two rows per team" counts rows, not score levels, so ROW_NUMBER is
-- the right function and n<=2 is the cut.
-- The window's id tiebreak decides which of two equally scoring players takes
-- the second slot; in team B that is Flo, since Eli takes the first.
-- Ordering the result by team,n reproduces the ranking order, so the two
-- ORDER BY clauses agree here even though they are separate clauses.
WITH r AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY team ORDER BY score DESC, id) AS n
  FROM scores
)
SELECT team,
       name
FROM r
WHERE n <= 2
ORDER BY team, n;

-- Why this works:
-- The cut is on score levels, not on rows, so DENSE_RANK is required: it
-- numbers distinct scores without gaps, and n<=2 means "the best two scores".
-- Team A's levels are 100 and 90, giving three players; team B's are 80 and
-- 60, giving all three of its players. RANK would have numbered team B
-- 1,1,3 and dropped Gus, and ROW_NUMBER would have kept only two per team.
-- The result is ordered by score descending with id as a tiebreak, which is
-- not the same as the window's order because that one has no id key.
WITH r AS (
  SELECT *,
         DENSE_RANK() OVER (PARTITION BY team ORDER BY score DESC) AS n
  FROM scores
)
SELECT team,
       name
FROM r
WHERE n <= 2
ORDER BY team, score DESC, id;

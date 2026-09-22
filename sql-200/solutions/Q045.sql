-- Why this works:
-- RANK gives every row tied for the best score the same number, 1, so
-- filtering on r=1 returns all of them rather than picking one.
-- Team B's Eli and Flo both score 80 and both come back, which is why the
-- result has three rows where Q044 had two.
-- The window must order by score alone: adding id would break the tie and
-- collapse this into the single-winner behaviour.
WITH ranked AS (
  SELECT *,
         RANK() OVER (PARTITION BY team ORDER BY score DESC) AS r
  FROM scores
)
SELECT team,
       name,
       score
FROM ranked
WHERE r = 1
ORDER BY team, id;

-- Why this works:
-- A bottom-N is a top-N with the window's ORDER BY reversed. SQLite sorts
-- ascending by default, so dropping DESC makes the lowest score row number 1.
-- ROW_NUMBER with the id tiebreak guarantees exactly one row per team and
-- resolves any tie in favour of the lower id, as the prompt requires.
-- Neither team's lowest score is actually tied here, but the tiebreak is what
-- makes the query deterministic if one ever were.
WITH r AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY team ORDER BY score, id) AS n
  FROM scores
)
SELECT team,
       name,
       score
FROM r
WHERE n = 1
ORDER BY team;

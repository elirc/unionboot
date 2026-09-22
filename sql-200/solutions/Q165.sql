-- Why this works:
-- Three stages, each a CTE, so the query reads top to bottom.
-- g repeats Q164's island key. c counts the rows per island, which is the
-- length of each run of consecutive days: 2, 3 and 1.
-- The final MAX over those counts returns one row, 3. MAX(COUNT(*)) cannot
-- be written in one step, because an aggregate may not be nested directly
-- inside another; the CTE is what separates the two levels.
WITH g AS (
  SELECT day,
         day - ROW_NUMBER() OVER (ORDER BY day) AS island
  FROM visits
),
c AS (
  SELECT island, COUNT(*) AS size
  FROM g
  GROUP BY island
)
SELECT MAX(size) AS largest
FROM c;

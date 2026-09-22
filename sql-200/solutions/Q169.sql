-- Why this works:
-- Identical machinery to Q168 with the comparison reversed: a run continues
-- while the level is <= the previous one, and an increase starts a new run.
-- The readings 80,60,50,50 form one non-increasing run of 4, which is the
-- answer; 55,54,54 is a run of 3 and 70 starts the last one.
-- Equality continues the run in both variants, which is why both use a
-- non-strict comparison; a strict one would split the 50,50 and 54,54 pairs.
WITH f AS (
  SELECT id,
         CASE WHEN level <= LAG(level) OVER (ORDER BY id) THEN 0 ELSE 1 END AS new_run
  FROM battery
),
s AS (
  SELECT id,
         SUM(new_run) OVER (ORDER BY id ROWS UNBOUNDED PRECEDING) AS run
  FROM f
),
c AS (
  SELECT run, COUNT(*) AS size
  FROM s
  GROUP BY run
)
SELECT MAX(size) AS longest
FROM c;

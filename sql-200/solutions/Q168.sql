-- Why this works:
-- Islands defined by a condition rather than by consecutive numbers need a
-- running-sum key instead of Q164's difference.
-- f flags the start of a new run: 0 while the level is >= the previous one,
-- 1 when it drops. The first row's LAG is NULL, the comparison is unknown,
-- and ELSE 1 makes it start the first run.
-- s turns those flags into a group id with a running SUM. The frame
-- ROWS UNBOUNDED PRECEDING means "every row from the start of the partition
-- up to this one", so the id increments exactly at each new run.
-- c counts the rows per run, and MAX takes the longest: 50,50,55 and
-- 54,54,70 are both length 3.
WITH f AS (
  SELECT id,
         CASE WHEN level >= LAG(level) OVER (ORDER BY id) THEN 0 ELSE 1 END AS new_run
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

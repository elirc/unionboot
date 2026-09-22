-- Why this works:
-- Same island key as Q164 and Q165; here each group is summarised instead
-- of being counted and collapsed to one number.
-- MIN(day) and MAX(day) inside a group are the first and last day of that
-- run, and COUNT(*) is its length.
-- The island key itself is not reported - it is an implementation detail -
-- so the result is ordered by start_day, which is meaningful.
WITH g AS (
  SELECT day,
         day - ROW_NUMBER() OVER (ORDER BY day) AS island
  FROM visits
),
agg AS (
  SELECT island,
         MIN(day) AS start_day,
         MAX(day) AS end_day,
         COUNT(*) AS size
  FROM g
  GROUP BY island
)
SELECT start_day, end_day, size
FROM agg
ORDER BY start_day;

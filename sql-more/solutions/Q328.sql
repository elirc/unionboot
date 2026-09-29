-- Why this works:
-- The prompt defines the gap against the previous distinct activity day, so
-- the first CTE removes the duplicated (1,1) row before any window function
-- runs.
-- LAG(day) reads the previous row's day within the same user, ordered by
-- day, so day - LAG(day) is the number of days since that user was last
-- seen.
-- On each user's first row LAG returns NULL and the gap is NULL; NULL is not
-- >= 2, so first visits are excluded without an extra clause.
-- User 1's distinct days are 0, 1, 3, giving gaps NULL, 1, 2 -- the 2 is the
-- reactivation. User 3's days 1 and 2 give a gap of 1 only.
-- The outer DISTINCT collapses a user who reactivated more than once.
WITH distinct_days AS (
  SELECT DISTINCT user_id, day
  FROM activity
),
g AS (
  SELECT user_id,
         day - LAG(day) OVER (PARTITION BY user_id ORDER BY day) AS gap
  FROM distinct_days
)
SELECT DISTINCT user_id
FROM g
WHERE gap >= 2
ORDER BY user_id;

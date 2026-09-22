-- Why this works:
-- No table is involved: the anchor is the literal row VALUES(2) and each pass
-- adds one to the previous value, so the CTE generates its own rows.
-- The guard WHERE n<6 is evaluated against the row being expanded, so 5
-- produces 6 and 6 produces nothing. The largest value generated is always
-- the guard's bound, which is why n<6 gives an inclusive 2..6 while n<=6
-- would overshoot to 7.
-- The square is computed in the final SELECT rather than carried through the
-- loop, since it depends only on n.
WITH RECURSIVE nums(n) AS (
  VALUES(2)
  UNION ALL
  SELECT n + 1
  FROM nums
  WHERE n < 6
)
SELECT n,
       n * n AS square
FROM nums
ORDER BY n;

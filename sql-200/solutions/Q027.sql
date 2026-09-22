-- Why this works:
-- COUNT(DISTINCT status) collapses repeats inside a bucket, so West's two
-- paid rows count as one status, not two.
-- The same expression appears in SELECT and in HAVING because HAVING is
-- evaluated over the finished bucket; repeating it is the portable form.
-- East mixes paid and pending and North mixes paid and refund, so both reach
-- two; South and West have a single status each and are dropped.
SELECT region,
       COUNT(DISTINCT status) AS statuses
FROM sales
GROUP BY region
HAVING COUNT(DISTINCT status) >= 2
ORDER BY region;

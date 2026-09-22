-- Why this works:
-- WHERE runs before GROUP BY, so the unpaid rows never reach a bucket and the
-- totals are computed from paid rows only: East 10+20, North 40, West 5.
-- South vanishes from the result entirely because its single row is pending;
-- a WHERE can empty a group out of existence, which HAVING cannot do.
-- SUM still skips West's NULL amount, leaving 5.
SELECT region,
       SUM(amount) AS total
FROM sales
WHERE status = 'paid'
GROUP BY region
ORDER BY region;

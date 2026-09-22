-- Why this works:
-- WHERE amount>0 discards both the negative refund and the NULL rows in one
-- comparison: NULL > 0 is unknown, and WHERE keeps only rows that are true.
-- HAVING then counts the rows that survived that filter, not the rows in the
-- table, so North fails with a single qualifying row even though it has two
-- rows overall.
-- East keeps all three positive amounts and reports their gross total, 130,
-- which is also its net total here because it has no negative row.
SELECT region,
       SUM(amount) AS total
FROM sales
WHERE amount > 0
GROUP BY region
HAVING COUNT(*) >= 2
ORDER BY region;

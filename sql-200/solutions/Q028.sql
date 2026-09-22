-- Why this works:
-- COUNT(*) counts every row in the bucket and COUNT(amount) counts only the
-- rows whose amount is known, so the two are equal exactly when the bucket
-- contains no NULL amount.
-- That single equality replaces a NOT EXISTS subquery.
-- East (3 = 3) and North (2 = 2) pass; West (2 <> 1) and South (1 <> 0) are
-- dropped as whole groups.
SELECT region,
       COUNT(*) AS entries
FROM sales
GROUP BY region
HAVING COUNT(*) = COUNT(amount)
ORDER BY region;

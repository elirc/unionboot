-- Why this works:
-- COUNT(*) counts rows in the bucket and never looks at a value, so it is
-- unaffected by NULL.
-- COUNT(amount) counts only the rows where amount is not NULL, so it is a
-- count of known values.
-- The two differ exactly where the seed hides a NULL: South reports 1 and 0,
-- West reports 2 and 1, and the two fully populated regions agree.
SELECT region,
       COUNT(*) AS rows_count,
       COUNT(amount) AS known_count
FROM sales
GROUP BY region
ORDER BY region;

SELECT region,COUNT(*) AS entries FROM sales GROUP BY region HAVING COUNT(*)=COUNT(amount) ORDER BY region;

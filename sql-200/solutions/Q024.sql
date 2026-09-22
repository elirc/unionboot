SELECT region,COUNT(*) AS rows_count,COUNT(amount) AS known_count FROM sales GROUP BY region ORDER BY region;

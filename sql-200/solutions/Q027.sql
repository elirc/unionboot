SELECT region,COUNT(DISTINCT status) AS statuses FROM sales GROUP BY region HAVING COUNT(DISTINCT status)>=2 ORDER BY region;

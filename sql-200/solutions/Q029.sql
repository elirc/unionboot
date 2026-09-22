SELECT region,SUM(amount) AS total FROM sales WHERE amount>0 GROUP BY region HAVING COUNT(*)>=2 ORDER BY region;

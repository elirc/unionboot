SELECT region,SUM(amount) AS total FROM sales WHERE status='paid' GROUP BY region HAVING SUM(amount)>=30 ORDER BY region;

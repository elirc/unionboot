SELECT region,SUM(amount) AS total FROM sales WHERE status='paid' GROUP BY region ORDER BY region;

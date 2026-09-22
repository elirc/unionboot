SELECT region,ROUND(AVG(amount),2) AS average FROM sales GROUP BY region ORDER BY region;

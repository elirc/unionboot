SELECT region,ROUND(AVG(COALESCE(amount,0)),2) AS average FROM sales GROUP BY region ORDER BY region;

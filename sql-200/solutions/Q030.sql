SELECT region,status,COUNT(*) AS entries,COALESCE(SUM(amount),0) AS total FROM sales GROUP BY region,status ORDER BY region,status;

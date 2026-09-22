SELECT name,email,COUNT(*) AS copies FROM raw GROUP BY name,email HAVING COUNT(*)>1 ORDER BY email,name;

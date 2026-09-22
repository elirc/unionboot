INSERT INTO moves VALUES(6,'A',-2,6);SELECT sku,SUM(delta) AS stock FROM moves GROUP BY sku ORDER BY sku;

SELECT sku,SUM(delta) AS on_hand FROM moves GROUP BY sku ORDER BY sku;

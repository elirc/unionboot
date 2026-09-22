SELECT sku,SUM(price*MAX(0,MIN(COALESCE(valid_to,6),6)-MAX(valid_from,2))) AS price_days FROM prices GROUP BY sku ORDER BY sku;

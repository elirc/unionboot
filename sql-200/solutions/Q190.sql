SELECT SUM(price) AS total,SUM(CASE WHEN price>? THEN 1 ELSE 0 END) AS expensive FROM products WHERE category=?;

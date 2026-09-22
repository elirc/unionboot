SELECT o.id,p.price FROM orders o LEFT JOIN prices p ON p.sku=o.sku AND p.valid_from<=o.day AND (p.valid_to>o.day OR p.valid_to IS NULL) ORDER BY o.id;

SELECT sku,price FROM prices WHERE valid_from<=6 AND (valid_to>6 OR valid_to IS NULL) ORDER BY sku;

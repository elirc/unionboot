SELECT sku,price FROM prices WHERE valid_from<=4 AND (valid_to>4 OR valid_to IS NULL) ORDER BY sku;

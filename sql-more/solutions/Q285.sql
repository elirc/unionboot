SELECT sku,valid_from,price FROM prices WHERE valid_to IS NULL ORDER BY sku;

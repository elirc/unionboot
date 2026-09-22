SELECT sku,valid_from,price FROM prices WHERE valid_from>6 ORDER BY valid_from,sku;

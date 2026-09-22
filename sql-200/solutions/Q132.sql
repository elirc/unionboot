INSERT INTO inventory VALUES('A',99,99,99) ON CONFLICT(sku) DO NOTHING; SELECT sku,qty,price,version FROM inventory ORDER BY sku;

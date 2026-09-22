INSERT INTO inventory VALUES('C',3,30,1) ON CONFLICT(sku) DO NOTHING; SELECT sku,qty,price,version FROM inventory ORDER BY sku;

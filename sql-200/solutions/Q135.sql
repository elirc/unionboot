INSERT INTO inventory VALUES('A',3,99,9),('B',4,99,9) ON CONFLICT(sku) DO UPDATE SET qty=MAX(inventory.qty,excluded.qty); SELECT sku,qty,price,version FROM inventory ORDER BY sku;

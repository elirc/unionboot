CREATE UNIQUE INDEX lines2_pair ON lines2(order_id,product_id); INSERT INTO lines2 VALUES(2,100); SELECT order_id,product_id FROM lines2 ORDER BY order_id,product_id;

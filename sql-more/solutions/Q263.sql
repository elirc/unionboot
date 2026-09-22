CREATE VIEW paid_orders AS SELECT id,amount FROM orders WHERE status='paid';UPDATE orders SET status='paid' WHERE id=2;SELECT * FROM paid_orders ORDER BY id;

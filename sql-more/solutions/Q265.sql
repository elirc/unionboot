CREATE VIEW paid_orders AS SELECT id,amount FROM orders WHERE status='paid';CREATE VIEW high_paid AS SELECT * FROM paid_orders WHERE amount>=20;SELECT * FROM high_paid ORDER BY id;

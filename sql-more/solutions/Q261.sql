CREATE VIEW paid_orders AS SELECT id,customer,amount FROM orders WHERE status='paid';SELECT * FROM paid_orders ORDER BY id;

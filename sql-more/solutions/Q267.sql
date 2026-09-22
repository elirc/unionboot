CREATE VIEW paid_orders AS SELECT * FROM orders WHERE status='paid';DROP VIEW paid_orders;SELECT COUNT(*) AS orders,(SELECT COUNT(*) FROM sqlite_schema WHERE name='paid_orders') AS views FROM orders;

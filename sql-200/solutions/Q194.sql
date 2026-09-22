CREATE INDEX orders2_cover ON orders2(status,customer_id); EXPLAIN QUERY PLAN SELECT customer_id FROM orders2 WHERE status='paid';

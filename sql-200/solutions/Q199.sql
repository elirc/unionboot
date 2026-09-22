CREATE INDEX orders2_status_cust ON orders2(status,customer_id); EXPLAIN QUERY PLAN SELECT customer_id FROM orders2 WHERE status='pending' ORDER BY customer_id;

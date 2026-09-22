CREATE INDEX orders2_status ON orders2(status); EXPLAIN QUERY PLAN SELECT * FROM orders2 WHERE status='paid';

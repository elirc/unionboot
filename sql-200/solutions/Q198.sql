EXPLAIN QUERY PLAN SELECT * FROM orders2 WHERE customer_id IN(SELECT customer_id FROM orders2 WHERE status='paid');

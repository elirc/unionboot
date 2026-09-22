-- Why this works:
-- An index stores its rows already sorted, so a query that filters on the
-- leading column and orders by the next one can read them out in order.
-- (status,customer_id) is exactly that shape for
-- WHERE status='pending' ORDER BY customer_id.
-- The plan is therefore a single covering-index search with no
-- USE TEMP B-TREE FOR ORDER BY step; the absence of that second row is what
-- the one-row expectation asserts.
-- Q200 shows the opposite case, where no usable index exists and SQLite
-- does build a temporary B-tree.
CREATE INDEX orders2_status_cust ON orders2(status, customer_id);
EXPLAIN QUERY PLAN
SELECT customer_id FROM orders2
WHERE status = 'pending'
ORDER BY customer_id;

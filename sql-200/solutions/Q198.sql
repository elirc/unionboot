-- Why this works:
-- The subquery is uncorrelated: it does not mention the outer row, so it is
-- evaluated once into a list rather than re-run per row. The plan calls
-- that LIST SUBQUERY 1.
-- Neither status nor customer_id is indexed, so both the outer query and
-- the subquery are table scans.
-- CREATE BLOOM FILTER is an optimisation SQLite adds to reject non-matching
-- outer rows cheaply before probing the list.
-- The four plan rows are asserted in the order SQLite returns them, and
-- this exact text is pinned to SQLite 3.49.1; another build may plan it
-- differently.
EXPLAIN QUERY PLAN
SELECT * FROM orders2
WHERE customer_id IN (SELECT customer_id FROM orders2 WHERE status = 'paid');

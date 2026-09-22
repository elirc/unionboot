-- Why this works:
-- A join is executed as nested loops: one table is the outer loop and the
-- other is probed once per outer row.
-- CROSS JOIN in SQLite is not a different join type; it is an instruction
-- to the planner to keep the written order, so orders2 stays outer. That
-- makes the plan deterministic enough to assert.
-- INDEXED BY requires the named index for that table, so the query fails
-- rather than quietly choosing another plan if the index is missing.
-- The outer step is a covering search on status, the inner step is a search
-- on lines2(order_id) for the current o.id, and the two plan rows come back
-- outer first.
-- These hints exist to make a teaching experiment reproducible; they are
-- not general tuning advice.
CREATE INDEX orders2_status ON orders2(status);
CREATE INDEX lines2_order ON lines2(order_id);
EXPLAIN QUERY PLAN
SELECT o.id, l.product_id
FROM orders2 AS o INDEXED BY orders2_status
CROSS JOIN lines2 AS l INDEXED BY lines2_order
WHERE o.status = 'paid'
  AND l.order_id = o.id;

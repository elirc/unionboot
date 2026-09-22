-- Why this works:
-- A covering index is one that contains every column the query needs, so
-- the table itself never has to be read.
-- The index holds (status,customer_id) and the query filters on status and
-- selects customer_id, so the index alone can answer it and the plan says
-- COVERING INDEX.
-- Column order matters: status is the leading column, which is what makes
-- the equality seek possible. An index on (customer_id,status) could not be
-- searched this way.
-- Q193 uses SELECT *, needs the other columns, and therefore gets a plain
-- INDEX plan rather than a covering one.
CREATE INDEX orders2_cover ON orders2(status, customer_id);
EXPLAIN QUERY PLAN
SELECT customer_id FROM orders2 WHERE status = 'paid';

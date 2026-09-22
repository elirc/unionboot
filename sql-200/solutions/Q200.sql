-- Why this works:
-- GROUP BY needs its rows grouped together. An index on product_id would
-- supply that order for free, but lines2 has none, so SQLite reads the
-- table and sorts into a temporary structure.
-- The plan therefore has two steps: SCAN lines2, then
-- USE TEMP B-TREE FOR GROUP BY, and both are graded in that order.
-- Seeing that second line on a large table is the usual sign that an index
-- on the grouping column would help.
EXPLAIN QUERY PLAN
SELECT product_id, COUNT(*) FROM lines2 GROUP BY product_id;

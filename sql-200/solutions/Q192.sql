-- Why this works:
-- status has no index in the seed, so SQLite has no way to jump to the
-- matching rows and reads every row of orders2, testing each one.
-- That is why the plan says SCAN orders2 with no index named and no
-- constraint in brackets.
-- The literal 'paid' is single-quoted: double quotes would be parsed as an
-- identifier first, and a typo would silently become a column reference.
-- This is the before half of the pair; Q193 adds the index and the plan
-- changes.
EXPLAIN QUERY PLAN
SELECT * FROM orders2 WHERE status = 'paid';

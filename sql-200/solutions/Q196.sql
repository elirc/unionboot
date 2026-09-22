-- Why this works:
-- This scenario runs the query rather than explaining it: a UNIQUE index is
-- a constraint as well as an access path.
-- lines2 already holds (1,100),(1,101),(3,100); those pairs are distinct,
-- so the index can be created on the existing data. A unique index cannot
-- be built over rows that already violate it.
-- (2,100) is a new pair - 100 appears elsewhere, but not with order 2 - so
-- the INSERT succeeds, and the grader's repeat of (1,100) fails with a
-- UNIQUE constraint error.
CREATE UNIQUE INDEX lines2_pair ON lines2(order_id, product_id);
INSERT INTO lines2 VALUES(2, 100);
SELECT order_id, product_id
FROM lines2
ORDER BY order_id, product_id;

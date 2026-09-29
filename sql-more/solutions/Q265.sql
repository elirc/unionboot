-- Why this works:
-- A view may read another view, which keeps the definition of paid in
-- exactly one place instead of repeating the predicate.
-- high_paid adds only its own rule, amount>=20, and inherits the paid
-- filter from the view it selects from.
-- Order 2 is 20 but pending, so it never reaches high_paid; order 4 is 40
-- but cancelled; only order 3 satisfies both layers.
-- status was already projected away by the inner view, so the outer one
-- could not filter on it even if it wanted to.
CREATE VIEW paid_orders AS
SELECT id,
       amount
FROM orders
WHERE status = 'paid';
CREATE VIEW high_paid AS
SELECT *
FROM paid_orders
WHERE amount >= 20;
SELECT *
FROM high_paid
ORDER BY id;

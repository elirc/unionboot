-- Why this works:
-- A view stores a definition, not rows, so it is re-evaluated against the
-- current base table every time it is read.
-- Marking order 2 as paid therefore changes what the view returns, with no
-- refresh step and nothing to invalidate.
-- The view could not have been stale: there was never a stored copy to go
-- stale in the first place.
-- SQLite has no materialized views, so this is the only behaviour available.
CREATE VIEW paid_orders AS
SELECT id,
       amount
FROM orders
WHERE status = 'paid';
UPDATE orders
SET status = 'paid'
WHERE id = 2;
SELECT *
FROM paid_orders
ORDER BY id;

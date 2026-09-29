-- Why this works:
-- SQLite has no CREATE OR REPLACE VIEW; that spelling is a syntax error, so
-- redefining a view means dropping it and creating it again.
-- That is safe precisely because a view stores no rows, so the drop
-- discards only the old query text.
-- The new definition widens the rule from one status to two with IN, which
-- admits the pending order 2 while still excluding the cancelled order 4.
-- The final SELECT reads the redefined view, so it returns three ids.
CREATE VIEW active_orders AS
SELECT id
FROM orders
WHERE status = 'paid';
DROP VIEW active_orders;
CREATE VIEW active_orders AS
SELECT id
FROM orders
WHERE status IN ('paid', 'pending');
SELECT id
FROM active_orders
ORDER BY id;

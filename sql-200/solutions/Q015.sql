-- Why this works:
-- Joining lines fans one order out into one row per line, so a plain
-- COUNT(o.id) would report 2 for Ada, whose single paid order has two lines.
-- COUNT(DISTINCT o.id) collapses that fan-out back to order grain.
-- The lines join is kept because the question is about orders that reached
-- the line table; the paid test stays in ON so Cy and Dee survive as zeros.
-- COUNT of an empty group is 0 without help, unlike SUM, so no COALESCE.
SELECT c.name,
       COUNT(DISTINCT o.id) AS paid_orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'
LEFT JOIN lines l ON l.order_id = o.id
GROUP BY c.id, c.name
ORDER BY c.id;

-- Why this works:
-- Every product must appear, including Lamp which is on no line at all, so
-- products drives LEFT JOINs and no WHERE may mention o.status.
-- The paid filter moves inside the aggregate instead: CASE with no ELSE
-- yields NULL for pending and cancelled rows, and COUNT ignores NULL, so
-- those rows are present but contribute nothing.
-- DISTINCT counts buyers rather than lines, so one customer buying the same
-- product on two paid orders still counts once.
SELECT p.name,
       COUNT(DISTINCT CASE WHEN o.status = 'paid' THEN o.customer_id END) AS buyers
FROM products p
LEFT JOIN lines l ON l.product_id = p.id
LEFT JOIN orders o ON o.id = l.order_id
GROUP BY p.id, p.name
ORDER BY p.id;

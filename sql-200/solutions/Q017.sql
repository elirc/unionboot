-- Why this works:
-- Reserved stock is the quantity sitting on pending orders, so the status
-- filter selects 'pending' rather than 'paid'.
-- Products with no pending demand must not appear, so the joins are inner;
-- this is the deliberate opposite of Q014, where every product had a row.
-- Only order 11 is pending and it carries one line, for Pad, so the grouped
-- result is a single row summing that line's qty.
SELECT p.name,
       SUM(l.qty) AS reserved
FROM products p
JOIN lines l ON l.product_id = p.id
JOIN orders o ON o.id = l.order_id
WHERE o.status = 'pending'
GROUP BY p.id, p.name
ORDER BY p.id;

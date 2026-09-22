-- Why this works:
-- Every customer must appear, so customers drives two LEFT JOINs.
-- The paid test belongs in the ON condition: in WHERE it would delete the
-- NULL-padded rows that Cy (cancelled only) and Dee (no orders) produce.
-- SUM over zero matched lines is NULL, not 0, so COALESCE turns the two
-- empty groups into the zeros the expected rows require.
-- Grouping by c.id as well as c.name keeps one group per customer even if two
-- customers shared a name.
SELECT c.name,
       COALESCE(SUM(l.qty * l.price), 0) AS spend
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'
LEFT JOIN lines l ON l.order_id = o.id
GROUP BY c.id, c.name
ORDER BY c.id;

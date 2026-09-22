-- Why this works:
-- The report has two grouping dimensions, customer and category, so both go
-- in the GROUP BY and one row is emitted per observed combination.
-- Only pairs that actually have paid sales are wanted, so inner joins are
-- correct: Ada/office, Ada/home and Bo/office exist, and every other
-- combination is simply never formed.
-- c.id is grouped alongside c.name so the grouping key is the primary key,
-- and ORDER BY c.id,p.category matches the requested ordering.
SELECT c.name,
       p.category,
       SUM(l.qty * l.price) AS total
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN lines l ON l.order_id = o.id
JOIN products p ON p.id = l.product_id
WHERE o.status = 'paid'
GROUP BY c.id, c.name, p.category
ORDER BY c.id, p.category;

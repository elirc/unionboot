-- Why this works:
-- The report is at line grain, so the chain runs customers -> orders -> lines
-- -> products and every join is inner: a line with no product, or an order
-- with no customer, would not be a reportable line anyway.
-- No customer has to be preserved here, so the paid restriction can sit in
-- WHERE, which runs after the joins are formed.
-- Aliases matter: customers.name and products.name would collide, so they are
-- renamed customer and product.
-- ORDER BY o.id,p.id fixes the order inside a multi-line order.
SELECT c.name AS customer,
       o.id AS order_id,
       p.name AS product,
       l.qty,
       l.qty * l.price AS amount
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN lines l ON l.order_id = o.id
JOIN products p ON p.id = l.product_id
WHERE o.status = 'paid'
ORDER BY o.id, p.id;

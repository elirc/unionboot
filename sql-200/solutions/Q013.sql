-- Why this works:
-- Revenue lives on lines, but the reporting dimension lives on products, so
-- the query joins products to lines and then up to orders to read the status.
-- Nothing has to be preserved: a category with no paid sales is simply absent
-- from the two expected rows, so inner joins and a WHERE are correct.
-- SUM(l.qty*l.price) aggregates at line grain, which is the grain money is
-- recorded at, so no fan-out correction is needed.
SELECT p.category,
       SUM(l.qty * l.price) AS revenue
FROM products p
JOIN lines l ON l.product_id = p.id
JOIN orders o ON o.id = l.order_id
WHERE o.status = 'paid'
GROUP BY p.category
ORDER BY p.category;

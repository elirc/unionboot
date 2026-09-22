SELECT p.category,SUM(l.qty*l.price) AS revenue FROM products p JOIN lines l ON l.product_id=p.id JOIN orders o ON o.id=l.order_id WHERE o.status='paid' GROUP BY p.category ORDER BY p.category;

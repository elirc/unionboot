SELECT p.name,SUM(l.qty) AS reserved FROM products p JOIN lines l ON l.product_id=p.id JOIN orders o ON o.id=l.order_id WHERE o.status='pending' GROUP BY p.id,p.name ORDER BY p.id;

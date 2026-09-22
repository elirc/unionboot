SELECT c.name FROM customers c WHERE NOT EXISTS(SELECT 1 FROM orders o JOIN lines l ON l.order_id=o.id WHERE o.customer_id=c.id AND o.status='paid') ORDER BY c.id;

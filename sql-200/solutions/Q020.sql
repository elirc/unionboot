SELECT ROUND(AVG(total),1) AS average_order FROM (SELECT o.id,SUM(l.qty*l.price) AS total FROM orders o JOIN lines l ON l.order_id=o.id WHERE o.status='paid' GROUP BY o.id);

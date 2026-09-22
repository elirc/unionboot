CREATE VIEW revenue AS SELECT customer,SUM(amount) AS total FROM orders WHERE status='paid' GROUP BY customer;SELECT * FROM revenue ORDER BY customer;

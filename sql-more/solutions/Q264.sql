CREATE VIEW totals(person,total) AS SELECT customer,SUM(amount) FROM orders GROUP BY customer;SELECT person,total FROM totals ORDER BY person;

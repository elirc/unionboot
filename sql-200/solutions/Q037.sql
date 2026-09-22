SELECT e.name,(SELECT SUM(b.amount) FROM bonuses b WHERE b.employee_id=e.id) AS bonus FROM employees e WHERE (SELECT SUM(b.amount) FROM bonuses b WHERE b.employee_id=e.id)>=15 ORDER BY e.id;

SELECT e.name FROM employees e WHERE NOT EXISTS(SELECT 1 FROM bonuses b WHERE b.employee_id=e.id) ORDER BY e.id;

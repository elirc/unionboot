SELECT e.name,COALESCE(b.total,0) AS bonus FROM employees e LEFT JOIN (SELECT employee_id,SUM(amount) AS total FROM bonuses GROUP BY employee_id) b ON b.employee_id=e.id ORDER BY e.id;

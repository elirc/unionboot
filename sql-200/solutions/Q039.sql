SELECT e.name,(SELECT COUNT(*) FROM employees x WHERE x.dept=e.dept AND x.salary>e.salary) AS higher FROM employees e ORDER BY e.id;

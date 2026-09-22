SELECT e.name FROM employees e WHERE e.salary IS NOT NULL AND NOT EXISTS(SELECT 1 FROM employees x WHERE x.dept=e.dept AND x.salary>e.salary) ORDER BY e.id;

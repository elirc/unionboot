WITH RECURSIVE tree(id,name) AS(SELECT id,name FROM staff WHERE manager_id=2 UNION ALL SELECT s.id,s.name FROM staff s JOIN tree t ON s.manager_id=t.id) SELECT name FROM tree ORDER BY id;

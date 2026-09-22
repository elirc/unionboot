DELETE FROM tasks WHERE owner IN(SELECT owner FROM tasks GROUP BY owner HAVING SUM(points)<3); SELECT id,owner FROM tasks ORDER BY id;

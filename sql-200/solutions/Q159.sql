DELETE FROM tasks WHERE NOT EXISTS(SELECT 1 FROM adjustments a WHERE a.owner=tasks.owner); SELECT id,owner FROM tasks ORDER BY id;

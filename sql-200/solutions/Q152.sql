DELETE FROM tasks WHERE EXISTS(SELECT 1 FROM blocked b WHERE b.owner=tasks.owner); SELECT id,owner FROM tasks ORDER BY id;

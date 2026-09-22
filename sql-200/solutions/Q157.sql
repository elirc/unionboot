UPDATE tasks SET points=COALESCE(points,0)+10 WHERE status='open' AND NOT EXISTS(SELECT 1 FROM blocked b WHERE b.owner=tasks.owner); SELECT id,points FROM tasks ORDER BY id;

UPDATE tasks SET status='urgent' WHERE id=(SELECT id FROM tasks WHERE status='open' ORDER BY points DESC,id LIMIT 1); SELECT id,status FROM tasks ORDER BY id;

UPDATE tasks SET status='cancelled' WHERE owner IN(SELECT owner FROM blocked); SELECT id,status FROM tasks ORDER BY id;

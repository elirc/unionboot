UPDATE tasks SET points=0 WHERE points IS NULL; SELECT id,points FROM tasks ORDER BY id;

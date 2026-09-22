SELECT id,CASE status WHEN 'open' THEN 'todo' WHEN 'closed' THEN 'done' ELSE 'waiting' END AS label FROM tickets ORDER BY id;

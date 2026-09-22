SELECT id,status FROM tickets ORDER BY CASE status WHEN 'pending' THEN 0 WHEN 'open' THEN 1 ELSE 2 END,id;

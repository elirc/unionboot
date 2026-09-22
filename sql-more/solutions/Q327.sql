SELECT u.id FROM users u WHERE NOT EXISTS(SELECT 1 FROM activity a WHERE a.user_id=u.id AND a.day BETWEEN 2 AND 3) ORDER BY u.id;

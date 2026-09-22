SELECT u.id FROM users u WHERE NOT EXISTS(SELECT 1 FROM activity a WHERE a.user_id=u.id) ORDER BY u.id;

SELECT u.id,COUNT(DISTINCT a.day) AS active_days FROM users u LEFT JOIN activity a ON a.user_id=u.id GROUP BY u.id ORDER BY u.id;

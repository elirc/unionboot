SELECT u.joined AS cohort,a.day-u.joined AS age,COUNT(DISTINCT u.id) AS active FROM users u JOIN activity a ON a.user_id=u.id GROUP BY cohort,age ORDER BY cohort,age;

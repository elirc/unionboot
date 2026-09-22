SELECT u.joined AS cohort,COUNT(DISTINCT CASE WHEN a.day>=u.joined+1 AND a.day<=3 THEN u.id END) AS retained FROM users u LEFT JOIN activity a ON a.user_id=u.id GROUP BY u.joined ORDER BY cohort;

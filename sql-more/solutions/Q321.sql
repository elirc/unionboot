SELECT joined AS cohort,COUNT(*) AS users FROM users GROUP BY joined ORDER BY joined;

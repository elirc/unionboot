SELECT id,LAG(value) OVER(PARTITION BY sensor ORDER BY day,id) AS previous FROM readings ORDER BY id;

SELECT id,LEAD(value,1,0) OVER(PARTITION BY sensor ORDER BY day,id) AS next FROM readings ORDER BY id;

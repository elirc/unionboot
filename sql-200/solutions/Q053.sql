SELECT id,value-LAG(value) OVER(PARTITION BY sensor ORDER BY day,id) AS delta FROM readings ORDER BY id;

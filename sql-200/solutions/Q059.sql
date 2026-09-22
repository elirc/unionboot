SELECT id,ROUND(100.0*value/SUM(value) OVER(PARTITION BY sensor),1) AS percent FROM readings ORDER BY id;

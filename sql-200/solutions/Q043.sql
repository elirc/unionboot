SELECT team,name,DENSE_RANK() OVER(PARTITION BY team ORDER BY score DESC) AS place FROM scores ORDER BY team,id;

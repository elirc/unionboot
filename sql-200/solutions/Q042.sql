SELECT team,name,RANK() OVER(PARTITION BY team ORDER BY score DESC) AS place FROM scores ORDER BY team,id;

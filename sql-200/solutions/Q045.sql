WITH ranked AS(SELECT *,RANK() OVER(PARTITION BY team ORDER BY score DESC) AS r FROM scores) SELECT team,name,score FROM ranked WHERE r=1 ORDER BY team,id;

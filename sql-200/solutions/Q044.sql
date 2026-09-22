WITH ranked AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY team ORDER BY score DESC,id) AS rn FROM scores) SELECT team,name,score FROM ranked WHERE rn=1 ORDER BY team;

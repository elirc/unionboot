WITH r AS(SELECT *,ROW_NUMBER() OVER(PARTITION BY team ORDER BY score,id) AS n FROM scores) SELECT team,name,score FROM r WHERE n=1 ORDER BY team;

WITH g AS(SELECT day,day-ROW_NUMBER() OVER(ORDER BY day) AS island FROM visits),c AS(SELECT island,COUNT(*) AS size FROM g GROUP BY island) SELECT MAX(size) AS largest FROM c;

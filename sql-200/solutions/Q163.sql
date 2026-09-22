SELECT day FROM (SELECT day,LEAD(day,1) OVER(ORDER BY day) AS d1,LEAD(day,2) OVER(ORDER BY day) AS d2 FROM visits) WHERE d1=day+1 AND d2=day+2 ORDER BY day;

SELECT day,day-ROW_NUMBER() OVER(ORDER BY day) AS island FROM visits ORDER BY day;

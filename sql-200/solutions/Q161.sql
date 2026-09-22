SELECT day,LEAD(day) OVER(ORDER BY day)-day AS gap FROM visits ORDER BY day;

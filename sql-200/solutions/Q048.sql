SELECT name,RANK() OVER(ORDER BY score DESC) AS place FROM scores ORDER BY score DESC,id;

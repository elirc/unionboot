WITH a AS(SELECT name FROM spring EXCEPT SELECT name FROM autumn),b AS(SELECT name FROM autumn EXCEPT SELECT name FROM spring) SELECT name FROM a UNION SELECT name FROM b ORDER BY name;

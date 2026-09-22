WITH both AS(SELECT name FROM spring UNION ALL SELECT name FROM autumn) SELECT name,COUNT(*) AS occurrences FROM both GROUP BY name ORDER BY name;

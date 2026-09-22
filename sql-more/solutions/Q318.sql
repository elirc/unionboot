WITH recipients(id) AS(VALUES(1),(2),(3)) SELECT id,100/3+CASE WHEN id<=100%3 THEN 1 ELSE 0 END AS cents FROM recipients ORDER BY id;

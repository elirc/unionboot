WITH RECURSIVE reach(node) AS(VALUES('A') UNION SELECT e.dst FROM edges e JOIN reach r ON e.src=r.node) SELECT name FROM nodes WHERE name NOT IN(SELECT node FROM reach) ORDER BY name;

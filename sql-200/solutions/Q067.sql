WITH RECURSIVE reach(node) AS(VALUES(1) UNION SELECT e.dst FROM edges e JOIN reach r ON e.src=r.node) SELECT node FROM reach ORDER BY node;

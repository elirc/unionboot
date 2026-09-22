DELETE FROM edges WHERE src='D' AND dst='B';WITH RECURSIVE reach(node) AS(VALUES('D') UNION SELECT dst FROM edges e JOIN reach r ON e.src=r.node) SELECT node FROM reach ORDER BY node;

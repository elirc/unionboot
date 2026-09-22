SELECT n.name,(SELECT p.mode FROM closure c JOIN policy p ON p.node=c.ancestor WHERE c.descendant=n.id ORDER BY c.depth LIMIT 1) AS mode FROM nodes n ORDER BY n.id;

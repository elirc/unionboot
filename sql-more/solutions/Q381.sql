SELECT n.id,n.name FROM closure c JOIN nodes n ON n.id=c.descendant WHERE c.ancestor=2 AND c.depth>0 ORDER BY n.id;

SELECT n.name FROM closure a JOIN closure b ON b.ancestor=a.ancestor JOIN nodes n ON n.id=a.ancestor WHERE a.descendant=4 AND b.descendant=5 ORDER BY a.depth+b.depth LIMIT 1;

SELECT MIN(a.depth+b.depth) AS distance FROM closure a JOIN closure b ON b.ancestor=a.ancestor WHERE a.descendant=4 AND b.descendant=3;

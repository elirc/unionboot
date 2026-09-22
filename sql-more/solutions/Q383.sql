SELECT n.name FROM nodes n WHERE EXISTS(SELECT 1 FROM closure c JOIN policy p ON p.node=c.ancestor WHERE c.descendant=n.id AND p.mode='deny') ORDER BY n.id;

SELECT l.key,l.value FROM local l WHERE NOT EXISTS(SELECT 1 FROM remote r WHERE r.key=l.key) ORDER BY l.key;

SELECT r.key,r.value FROM remote r WHERE NOT EXISTS(SELECT 1 FROM local l WHERE l.key=r.key) ORDER BY r.key;

SELECT l.key FROM local l JOIN remote r USING(key) WHERE l.value IS r.value ORDER BY l.key;

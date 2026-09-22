SELECT l.key,r.value-l.value AS delta FROM local l JOIN remote r USING(key) WHERE l.value IS NOT NULL AND r.value IS NOT NULL ORDER BY l.key;

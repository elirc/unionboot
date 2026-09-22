SELECT l.key,l.value AS old_value,r.value AS new_value FROM local l JOIN remote r USING(key) WHERE l.value IS NOT r.value ORDER BY l.key;

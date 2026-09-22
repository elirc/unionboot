SELECT group_concat(name,',') AS roster FROM (SELECT trim(name) AS name FROM contacts ORDER BY id DESC);

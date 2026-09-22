SELECT id,CAST(json_extract(body,'$.age') AS INTEGER) AS age FROM docs ORDER BY id;

SELECT id,json_extract(body,'$.name') AS name FROM docs ORDER BY id;

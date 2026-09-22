SELECT id,json_extract(body,'$.age') AS age,typeof(json_extract(body,'$.age')) AS kind FROM docs ORDER BY id;

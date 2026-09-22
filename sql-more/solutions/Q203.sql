SELECT id,json_type(body,'$.city') AS kind FROM docs ORDER BY id;

SELECT id FROM docs WHERE json_type(body,'$.city') IS NULL ORDER BY id;

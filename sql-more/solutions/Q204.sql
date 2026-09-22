SELECT id FROM docs WHERE json_type(body,'$.age')='integer' ORDER BY id;

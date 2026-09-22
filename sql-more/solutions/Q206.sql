SELECT id FROM docs WHERE json_type(body,'$.active')='true' ORDER BY id;

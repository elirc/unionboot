SELECT id FROM docs WHERE json_type(body,'$.city')='null' ORDER BY id;

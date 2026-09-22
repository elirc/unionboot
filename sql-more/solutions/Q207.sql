SELECT body->'$.name' AS json_name,body->>'$.name' AS sql_name FROM docs WHERE id=1;

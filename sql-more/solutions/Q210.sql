SELECT id,json_extract(body,'$.name','$.city') AS pair FROM docs ORDER BY id;

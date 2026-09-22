SELECT id,json_array_length(body,'$.tags') AS tags FROM baskets ORDER BY id;

SELECT json_extract(json_set(body,'$.tags',json('["x","y"]')),'$.tags') AS tags FROM configs;

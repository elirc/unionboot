SELECT json_extract(json_patch(body,'{"tags":["b"]}'),'$.tags') AS tags FROM configs;

SELECT json_extract(json_insert(body,'$.tags[#]','b'),'$.tags') AS tags FROM configs;

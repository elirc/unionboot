SELECT json_insert(body,'$.mode','live','$.flag',1) AS body FROM configs;

SELECT json_replace(body,'$.mode','live','$.flag',1) AS body FROM configs;

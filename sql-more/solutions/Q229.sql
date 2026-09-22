UPDATE configs SET body=json_set(body,'$.n',json_extract(body,'$.n')+3); SELECT json_extract(body,'$.n') AS n,json_extract(body,'$.mode') AS mode FROM configs;

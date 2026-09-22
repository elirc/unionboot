SELECT id,json_extract(body,'$.tags[#-1]') AS last_tag FROM baskets ORDER BY id;

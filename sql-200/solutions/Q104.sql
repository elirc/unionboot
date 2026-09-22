SELECT id,substr(code,1,2) AS prefix,CAST(substr(code,4) AS INTEGER) AS number FROM contacts ORDER BY id;

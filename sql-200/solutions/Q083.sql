SELECT id,COALESCE(NULLIF(label,''),'unknown') AS label FROM measures ORDER BY id;

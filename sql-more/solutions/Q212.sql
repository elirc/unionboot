SELECT b.id,j.key AS position,j.value AS tag FROM baskets b,json_each(b.body,'$.tags') j ORDER BY b.id,j.key;

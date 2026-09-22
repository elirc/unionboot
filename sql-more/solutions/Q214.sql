SELECT DISTINCT j.value AS tag FROM baskets b,json_each(b.body,'$.tags') j ORDER BY tag;

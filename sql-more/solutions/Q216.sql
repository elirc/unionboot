SELECT b.id,json_extract(j.value,'$.sku') AS sku,json_extract(j.value,'$.qty') AS qty FROM baskets b,json_each(b.body,'$.items') j ORDER BY b.id,j.key;

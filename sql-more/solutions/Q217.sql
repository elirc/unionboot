SELECT json_extract(j.value,'$.sku') AS sku,SUM(json_extract(j.value,'$.qty')) AS qty FROM baskets b,json_each(b.body,'$.items') j GROUP BY sku ORDER BY sku;

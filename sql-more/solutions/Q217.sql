-- Why this works:
-- Once json_each has expanded every basket's items, the exploded rows behave
-- like an ordinary table and can be aggregated directly.
-- GROUP BY names the extracted sku, not j.value: grouping by the raw item
-- object would put A/qty 2 and A/qty 3 in different buckets.
-- SUM adds the extracted quantities across documents, so SKU A collects
-- 2 from basket 1 and 3 from basket 3.
-- Referring to the alias sku in GROUP BY and ORDER BY avoids repeating the
-- json_extract expression.
SELECT json_extract(j.value, '$.sku') AS sku,
       SUM(json_extract(j.value, '$.qty')) AS qty
FROM baskets b,
     json_each(b.body, '$.items') j
GROUP BY sku
ORDER BY sku;

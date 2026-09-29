-- Why this works:
-- Expanding '$.items' yields one row per item, but each j.value is the whole
-- item object rendered as JSON text, not a set of columns.
-- So a second json_extract is applied to j.value to read '$.sku' and
-- '$.qty' out of that nested object.
-- qty arrives as a SQL integer because the JSON values are JSON numbers; no
-- cast is needed.
-- Basket 2 has an empty items array and the comma lateral join drops it.
SELECT b.id,
       json_extract(j.value, '$.sku') AS sku,
       json_extract(j.value, '$.qty') AS qty
FROM baskets b,
     json_each(b.body, '$.items') j
ORDER BY b.id,
         j.key;

-- Why this works:
-- The policy is preserve: json_extract hands back a SQL value whose type
-- mirrors the JSON type, so Ada's number 30 stays integer and Bo's string
-- "20" stays text even though it looks numeric.
-- typeof is applied to the extracted value, not to body; typeof(body) would
-- always report text because the column stores JSON source.
-- Cy has no age key, so json_extract returns SQL NULL and typeof reports the
-- four-character string 'null'.
SELECT id,
       json_extract(body, '$.age') AS age,
       typeof(json_extract(body, '$.age')) AS kind
FROM docs
ORDER BY id;

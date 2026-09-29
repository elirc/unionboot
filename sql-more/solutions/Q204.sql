-- Why this works:
-- The policy is require: only a JSON integer qualifies, so the filter
-- compares the type label rather than the value.
-- Ada's age is the JSON number 30 and json_type returns 'integer'.
-- Bo's age is the JSON string "20"; json_type returns 'text', so Bo is
-- rejected even though the characters look numeric.
-- Cy has no age key at all; json_type returns SQL NULL, and NULL = 'integer'
-- is unknown, so the WHERE clause drops that row too.
SELECT id
FROM docs
WHERE json_type(body, '$.age') = 'integer'
ORDER BY id;

-- Why this works:
-- This is the mirror image of the missing-key query: only an explicit JSON
-- null qualifies.
-- json_type returns the text 'null' for Ada, whose city member is present
-- and holds JSON null, so the equality matches.
-- Bo has no city key, so json_type is SQL NULL and the comparison is
-- unknown, which the WHERE clause treats as not true.
-- Cy's city is a string, so json_type is 'text' and does not match.
SELECT id
FROM docs
WHERE json_type(body, '$.city') = 'null'
ORDER BY id;

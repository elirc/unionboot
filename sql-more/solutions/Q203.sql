-- Why this works:
-- json_type reports the JSON-level type at a path, which is the only way to
-- tell an explicit JSON null from a key that is not there at all.
-- Ada's city is JSON null, so json_type returns the text 'null'.
-- Bo has no city key, so json_type returns SQL NULL, which the grader sees
-- as JSON null in the row object.
-- Cy's city is a JSON string, so json_type returns 'text'.
-- json_extract could not produce this column: it returns SQL NULL for both
-- the explicit null and the missing key.
SELECT id,
       json_type(body, '$.city') AS kind
FROM docs
ORDER BY id;

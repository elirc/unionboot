-- Why this works:
-- Only a missing key qualifies, and json_type is the function that can see
-- the difference: it returns SQL NULL when the path does not exist and the
-- text 'null' when the key is present holding JSON null.
-- Bo's document has no city member, so json_type is NULL and the row is kept.
-- Ada's city is an explicit JSON null, so json_type is 'null' and she is
-- excluded, exactly as the prompt requires.
-- The test must be IS NULL; = NULL is unknown and would return no rows.
SELECT id
FROM docs
WHERE json_type(body, '$.city') IS NULL
ORDER BY id;

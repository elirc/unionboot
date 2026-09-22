-- Why this works:
-- SQL has no "bind an array" parameter: one placeholder binds one scalar.
-- An IN list of n values therefore needs n placeholders, and the calling
-- code builds the ?,? text from the length of its array - the structure of
-- the query is generated, the values still are not.
-- Two ids are supplied here, so the list is exactly (?,?) and the harness
-- binds 1 and 3.
SELECT id, name
FROM products
WHERE id IN (?, ?)
ORDER BY id;

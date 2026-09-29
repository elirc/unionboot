-- Why this works:
-- SQLite has no boolean storage type, so json_extract turns JSON true into
-- the integer 1 and JSON false into 0; comparing the extracted value with
-- the text 'true' would match nothing.
-- json_type looks at the JSON document instead and returns the label 'true'
-- only for a genuine JSON true, which is the comparison the prompt asks for.
-- Ada and Cy carry "active":true; Bo carries false and is rejected.
SELECT id
FROM docs
WHERE json_type(body, '$.active') = 'true'
ORDER BY id;

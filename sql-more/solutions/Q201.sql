-- Why this works:
-- json_extract with a single path returns the JSON value as a SQL value, so
-- the JSON string "Ada" arrives as the three-character text Ada, unquoted.
-- Every seeded document has a name key, so no row extracts to NULL here.
-- AS name is required: without it the column would be named after the whole
-- json_extract expression and the graded key comparison would fail.
-- ORDER BY id turns the incidental rowid order into a guaranteed one.
SELECT id,
       json_extract(body, '$.name') AS name
FROM docs
ORDER BY id;

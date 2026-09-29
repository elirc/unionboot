-- Why this works:
-- A bare SQL string argument is stored as a JSON string, so passing
-- '["x","y"]' directly would produce the member "tags":"[\"x\",\"y\"]".
-- json() parses its argument and marks the result as JSON, so json_set
-- stores a real array instead of text that looks like one.
-- The difference is invisible until something reads the value back: only the
-- json() form makes json_extract return an array.
-- The outer json_extract projects the tags member the prompt asks for.
SELECT json_extract(json_set(body, '$.tags', json('["x","y"]')), '$.tags') AS tags
FROM configs;

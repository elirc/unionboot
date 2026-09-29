-- Why this works:
-- json_patch implements JSON Merge Patch: the second argument is itself a
-- document, merged into the first recursively.
-- A patch member whose value is null deletes the target member, so
-- "mode":null removes mode rather than setting it to JSON null.
-- Objects merge member by member, so "nested":{"x":9} changes x and leaves
-- y untouched; only members named in the patch are affected.
-- n and tags are not mentioned and therefore survive unchanged.
SELECT json_patch(body, '{"mode":null,"nested":{"x":9}}') AS body
FROM configs;

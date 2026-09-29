-- Why this works:
-- json_set overwrites a path that exists and creates one that does not, so a
-- single call covers both edits the prompt asks for.
-- The pairs are applied left to right: '$.mode' already exists and is
-- replaced in place, keeping its original first position.
-- '$.flag' is new, so SQLite appends it after the existing members, which is
-- why the expected text ends with "flag":1.
-- The function returns new text; the stored row is not modified.
SELECT json_set(body, '$.mode', 'live', '$.flag', 1) AS body
FROM configs;

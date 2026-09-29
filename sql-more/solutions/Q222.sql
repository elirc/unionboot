-- Why this works:
-- json_insert only creates paths that are absent; it never overwrites.
-- The arguments here are identical to the json_set scenario, but '$.mode'
-- already exists, so the value live is discarded and mode stays draft.
-- '$.flag' is missing, so it is created and appended at the end of the
-- document.
-- This is the function to reach for when an edit must not clobber data that
-- somebody else already wrote.
SELECT json_insert(body, '$.mode', 'live', '$.flag', 1) AS body
FROM configs;

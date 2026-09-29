-- Why this works:
-- json_replace is the mirror of json_insert: it only touches paths that are
-- already present and never creates one.
-- '$.mode' exists, so it is overwritten with live.
-- '$.flag' does not exist, so that pair is ignored entirely and the returned
-- document has no flag member at all.
-- Passing a path that is not there is not an error, which is what makes this
-- function a safe way to express update-if-present.
SELECT json_replace(body, '$.mode', 'live', '$.flag', 1) AS body
FROM configs;

-- Why this works:
-- json_remove deletes the members named by its paths and returns the new
-- document; it accepts several paths in one call.
-- '$.nested.y' uses dot notation to reach inside the nested object, so only
-- y is deleted and x survives.
-- '$.n' removes the top-level counter.
-- Every other member keeps its original position, so the result reads
-- mode, tags, nested.
SELECT json_remove(body, '$.nested.y', '$.n') AS body
FROM configs;

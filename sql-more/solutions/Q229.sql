-- Why this works:
-- The JSON functions return new text and never modify a row, so persisting a
-- change needs an UPDATE that writes the returned document back.
-- json_extract(body,'$.n') inside json_set reads the row's current value, so
-- the expression adds three to the stored 2 and yields 5.
-- The runtime grades only the final statement, so the UPDATE runs purely for
-- its effect and the SELECT supplies the rows.
-- mode is read back unchanged, which proves the rest of the document
-- survived the rewrite.
UPDATE configs
SET body = json_set(body, '$.n', json_extract(body, '$.n') + 3);
SELECT json_extract(body, '$.n') AS n,
       json_extract(body, '$.mode') AS mode
FROM configs;

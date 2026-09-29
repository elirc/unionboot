-- Why this works:
-- Inside array brackets the SQLite JSON path token # means the array length,
-- so '$.tags[#]' names the position one past the last element.
-- That position does not exist yet, which is exactly the case json_insert
-- handles: it creates it, appending b after a.
-- json_set would behave the same here, but json_insert states the intent
-- that nothing existing may be overwritten.
-- The outer json_extract projects just the tags array, since the prompt asks
-- for that column rather than the whole document.
SELECT json_extract(json_insert(body, '$.tags[#]', 'b'), '$.tags') AS tags
FROM configs;

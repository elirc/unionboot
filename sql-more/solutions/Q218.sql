-- Why this works:
-- SQLite JSON paths allow # inside array brackets to mean the array length,
-- so '$.tags[#-1]' addresses the final element without knowing how many
-- elements there are.
-- No expansion is needed: each basket stays one row.
-- On basket 2 the array is empty, the path resolves to nothing and
-- json_extract returns SQL NULL rather than raising.
-- Plain negative indexes such as [-1] are not valid SQLite path syntax.
SELECT id,
       json_extract(body, '$.tags[#-1]') AS last_tag
FROM baskets
ORDER BY id;

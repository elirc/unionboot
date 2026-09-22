-- Why this works:
-- GLOB is SQLite's case-sensitive pattern operator and uses shell-style
-- wildcards: * is any run of characters, ? is exactly one.
-- 'XY-*' therefore anchors at the start of the string and matches XY-010
-- and XY-011 but not a lower-case 'xy-' prefix.
-- LIKE would be the wrong operator here: its default is case-insensitive
-- for ASCII, and its wildcards are % and _.
SELECT id,
       code
FROM contacts
WHERE code GLOB 'XY-*'
ORDER BY id;

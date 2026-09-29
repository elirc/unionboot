-- Why this works:
-- Merge Patch merges objects but never merges arrays: an array in the patch
-- replaces the target array wholesale.
-- So patching with {"tags":["b"]} yields ["b"], not ["a","b"], even though
-- the stored array already held a.
-- Appending instead would need the [#] path with json_insert, which is a
-- different scenario in this family.
-- json_extract then projects the tags member for the graded column.
SELECT json_extract(json_patch(body, '{"tags":["b"]}'), '$.tags') AS tags
FROM configs;

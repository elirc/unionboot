-- Why this works:
-- The filter and the projection must both trim, or row 1 (' Ada ') would be
-- measured as length 5 and dropped.
-- length() on text counts characters, not bytes, so a multi-byte character
-- still counts as one.
-- Trimming preserves case: 'cy' stays lower case and is excluded only
-- because its length is 2.
SELECT id,
       trim(name) AS name
FROM contacts
WHERE length(trim(name)) = 3
ORDER BY id;

-- Why this works:
-- replace(source,search,replacement) rewrites every occurrence, not just
-- the first, and returns a new string; the stored row is untouched.
-- The replacement is the empty string, which deletes the hyphen.
-- replace() on a NULL argument returns NULL, but no code is NULL here.
SELECT id,
       replace(code, '-', '') AS compact
FROM contacts
ORDER BY id;

-- Why this works:
-- instr(email,'@') gives the 1-based position of the first '@', so
-- instr(...)+1 is the first character of the domain.
-- substr(text,start) with no length argument runs to the end of the string.
-- lower() normalises the domain to ASCII lower case.
-- WHERE email IS NOT NULL drops row 4. IS NOT NULL is the only test that
-- answers true or false for NULL; email <> NULL would be NULL and filter
-- the row out for the wrong reason.
SELECT id,
       lower(substr(email, instr(email, '@') + 1)) AS domain
FROM contacts
WHERE email IS NOT NULL
ORDER BY id;

-- Why this works:
-- Every code has the fixed shape 'XX-NNN', so the parse is positional.
-- substr(code,1,2) takes the two-letter prefix starting at position 1.
-- substr(code,4) skips the hyphen and runs to the end of the string.
-- CAST(... AS INTEGER) turns the text '001' into the number 1; without the
-- cast the column would be the text '001' and the exact row comparison
-- would fail on type as well as on value.
SELECT id,
       substr(code, 1, 2) AS prefix,
       CAST(substr(code, 4) AS INTEGER) AS number
FROM contacts
ORDER BY id;

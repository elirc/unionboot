-- Why this works:
-- The policy is coerce: whatever JSON stored, the column must be an integer.
-- CAST(... AS INTEGER) turns the text '20' into 20 and leaves the integer 30
-- unchanged.
-- CAST passes SQL NULL through as NULL rather than converting it to 0, which
-- is what keeps Cy's absent age as null instead of a fabricated zero.
-- Note that CAST never raises in SQLite: a non-numeric string would become 0
-- silently, so this policy suits trusted data.
SELECT id,
       CAST(json_extract(body, '$.age') AS INTEGER) AS age
FROM docs
ORDER BY id;

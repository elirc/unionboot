-- Why this works:
-- Two different kinds of missing label have to end up the same way, so the
-- functions are nested.
-- NULLIF(label,'') turns an empty string into a NULL, which is what row 3
-- needs; COALESCE then replaces every NULL, whether it came from the table
-- or from that conversion, with 'unknown'.
-- COALESCE alone would leave row 3 as an empty string, because '' is a value
-- and not a NULL.
SELECT id,
       COALESCE(NULLIF(label, ''), 'unknown') AS label
FROM measures
ORDER BY id;

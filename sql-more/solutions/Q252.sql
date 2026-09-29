-- Why this works:
-- AND is part of the FTS5 query language, not SQL, so it lives inside the
-- single string on the right of MATCH.
-- Both tokens must appear somewhere in the document, but not in the same
-- column and not next to each other.
-- Document 1 has quick and fox in its body; document 2 has quick but no
-- fox, and document 3 has fox but no quick, so both are excluded.
-- The operator must be uppercase: a lowercase and would be searched for as
-- an ordinary token.
SELECT rowid
FROM articles
WHERE articles MATCH 'quick AND fox'
ORDER BY rowid;

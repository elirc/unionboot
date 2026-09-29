-- Why this works:
-- FTS5 NOT is a binary operator: it means matches the left side and not the
-- right, so it needs a left operand and cannot be used on its own.
-- blue matches documents 2 and 4; document 2 also contains bird and is
-- therefore subtracted, leaving document 4.
-- The exclusion is evaluated against the whole document, so a bird in the
-- title would remove the row just as one in the body does.
SELECT rowid
FROM articles
WHERE articles MATCH 'blue NOT bird'
ORDER BY rowid;

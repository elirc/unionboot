-- Why this works:
-- MATCH with the table name on the left searches every indexed column, so a
-- document qualifies whether the token is in its title or its body.
-- FTS5 stores tokens, not characters, and the default unicode61 tokenizer
-- folds case, so the query fox also finds the title Fox notes.
-- Each document is returned once however many times the token occurs.
-- ORDER BY rowid makes the document order explicit; ORDER BY rank would
-- sort by relevance instead.
SELECT rowid,
       title
FROM articles
WHERE articles MATCH 'fox'
ORDER BY rowid;

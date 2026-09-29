-- Why this works:
-- highlight is an FTS5 auxiliary function: it re-renders one column of a
-- matching row with markers around the tokens that matched.
-- The column argument is a zero-based position in the CREATE VIRTUAL TABLE
-- declaration, so 0 is title and 1 would be body.
-- It marks the stored text, not a normalized copy, which is why document 3
-- comes back as [Fox] notes with its original capital letter.
-- The function only makes sense in a query that has a MATCH, because it
-- needs to know what matched.
SELECT rowid,
       highlight(articles, 0, '[', ']') AS marked
FROM articles
WHERE articles MATCH 'fox'
ORDER BY rowid;

-- Why this works:
-- OR inside the query string unions the two token searches and still returns
-- each document once, which is what one row per document requires.
-- Documents 1 and 3 match fox, document 4 matches flowers, and document 2
-- has neither.
-- Writing this as two separate MATCH calls joined by SQL OR is not the same
-- thing: a single FTS5 table reference accepts only one match constraint.
-- ORDER BY rowid puts the union back into document order.
SELECT rowid
FROM articles
WHERE articles MATCH 'fox OR flowers'
ORDER BY rowid;

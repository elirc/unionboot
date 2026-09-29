-- Why this works:
-- The index holds whole tokens, so searching for flo matches nothing at all:
-- the stored token is flowers.
-- A trailing star asks FTS5 for every token beginning with those letters,
-- which is the only wildcard form the query language supports.
-- The star must be attached to the term with no space, and there is no
-- leading or infix wildcard.
-- Only document 4 contains a token starting with flo.
SELECT rowid
FROM articles
WHERE articles MATCH 'flo*'
ORDER BY rowid;

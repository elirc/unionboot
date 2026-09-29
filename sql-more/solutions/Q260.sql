-- Why this works:
-- This is an ordinary contentful FTS5 table, so it stores the text itself
-- and maintains its own token index.
-- Updating the body of document 4 therefore re-tokenizes that column right
-- away; no rebuild command and no trigger is involved.
-- The search that follows is unchanged from the plain single-token
-- scenario, but now returns three documents instead of two.
-- An external-content table, declared with a content= option, would need
-- extra machinery to keep the index in step.
UPDATE articles
SET body = 'quick fox'
WHERE rowid = 4;
SELECT rowid
FROM articles
WHERE articles MATCH 'fox'
ORDER BY rowid;

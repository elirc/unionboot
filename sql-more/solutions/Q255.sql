-- Why this works:
-- FTS5 records the position of every token, which is what makes a phrase
-- query possible.
-- Double quotes inside the single-quoted SQL string mark a phrase, so the
-- two tokens must be adjacent and in the written order.
-- Without the inner quotes the terms would be an implicit AND and could
-- appear anywhere in the document in either order.
-- Only document 1 has quick immediately followed by brown.
SELECT rowid
FROM articles
WHERE articles MATCH '"quick brown"'
ORDER BY rowid;

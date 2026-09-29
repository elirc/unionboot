-- Why this works:
-- pragma_index_xinfo lists one row per index entry, including a trailing
-- entry for the rowid, so WHERE key=1 keeps only the declared key columns.
-- This index is built on an expression rather than a column, so SQLite has
-- no table column to point at: cid is -2 and name is NULL.
-- A cid of -1 would mean the rowid, and a cid of 0 or more would be an
-- ordinary column position.
-- ORDER BY seqno fixes the key order, which matters once an index has more
-- than one entry.
CREATE INDEX normalized ON users(lower(email));
SELECT seqno,
       cid,
       name
FROM pragma_index_xinfo('normalized')
WHERE key = 1
ORDER BY seqno;

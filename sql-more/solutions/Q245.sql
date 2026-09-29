-- Why this works:
-- A composite index records both the order of its key columns and the sort
-- direction of each one, and index_xinfo exposes both.
-- seqno gives the position, so ORDER BY seqno returns tenant before email.
-- The desc column is 0 for an ascending key and 1 for a descending one, so
-- tenant reports 0 and email reports 1.
-- desc is not a reserved word here, but it is aliased to descending because
-- the expected column name says so.
-- WHERE key=1 again drops the appended rowid entry.
CREATE INDEX tenant_email ON users(tenant ASC, email DESC);
SELECT name,
       desc AS descending
FROM pragma_index_xinfo('tenant_email')
WHERE key = 1
ORDER BY seqno;

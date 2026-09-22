-- Why this works:
-- EXPLAIN QUERY PLAN does not run the query; it returns the plan SQLite
-- chose, one row per step. The runner keeps only the detail column, because
-- the node and parent ids are version-dependent bookkeeping.
-- id is declared INTEGER PRIMARY KEY, which makes it an alias for the
-- rowid, so an equality test on it is a direct B-tree lookup.
-- SEARCH means "go straight to the matching rows"; SCAN, the word in Q192,
-- means "read the whole table". The (rowid=?) suffix shows the constraint
-- the plan is using, with the literal rendered as ?.
-- The detail text is pinned to SQLite 3.49.1 and may differ elsewhere.
EXPLAIN QUERY PLAN
SELECT * FROM orders2 WHERE id = 1;

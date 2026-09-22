-- Why this works:
-- A UNIQUE column constraint has to be enforced somehow, so SQLite creates
-- a real index for it and names it sqlite_autoindex_<table>_<n>.
-- That index is persistent schema, not a transient structure, and the
-- planner can use it for reads as well, which is why the lookup is a
-- COVERING INDEX search rather than a table scan.
-- It is not the same thing as "AUTOMATIC COVERING INDEX", the throwaway
-- index SQLite sometimes builds for one query; this one exists because of
-- the constraint.
-- x is the only column, so the index covers SELECT *.
CREATE TABLE t2(x TEXT UNIQUE);
EXPLAIN QUERY PLAN
SELECT * FROM t2 WHERE x = 'a';

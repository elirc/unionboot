-- Why this works:
-- SQLite can use an index built on an expression only when the query repeats
-- that expression, so the WHERE clause says lower(email) and not email.
-- EXPLAIN QUERY PLAN reports the chosen access path instead of running the
-- query, and the runtime keeps only the detail column of that output.
-- COVERING in the detail means every column the query needs is already in
-- the index, so the table itself is never read.
-- <expr> is how SQLite renders an indexed expression it cannot name.
CREATE INDEX normalized ON users(lower(email));
EXPLAIN QUERY PLAN
SELECT id
FROM users
WHERE lower(email) = 'ada@x';

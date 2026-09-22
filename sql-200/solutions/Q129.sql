-- Why this works:
-- An ordinary SQLite table has dynamic typing: the declared type is only an
-- affinity, and 'seven' would be stored as text in an INTEGER column.
-- The STRICT keyword turns the declared type into a real constraint, so the
-- grader's insert of 'seven' fails with "cannot store TEXT value in INTEGER
-- column".
-- STRICT accepts only a fixed set of type names (INT, INTEGER, REAL, TEXT,
-- BLOB, ANY), which is why the column is declared INTEGER and not a made-up
-- alias.
CREATE TABLE amounts(id INTEGER PRIMARY KEY, value INTEGER NOT NULL) STRICT;
INSERT INTO amounts VALUES(1, 7);
SELECT id, value
FROM amounts
ORDER BY id;

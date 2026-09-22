-- Why this works:
-- A TEXT column with no COLLATE clause uses BINARY collation, which
-- compares byte by byte, so 'Ada@x' and 'ada@x' are different values.
-- UNIQUE builds an index using that collation, so both rows are accepted
-- and only an exact repeat of 'Ada@x' violates it.
-- This is the contrast case for Q124, which swaps in COLLATE NOCASE.
CREATE TABLE users(id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE);
INSERT INTO users VALUES(1, 'Ada@x'), (2, 'ada@x');
SELECT id, email
FROM users
ORDER BY id;

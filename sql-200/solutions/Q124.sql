-- Why this works:
-- COLLATE NOCASE on the column makes the UNIQUE index compare case
-- insensitively, so 'ada@x' now collides with the stored 'Ada@x'.
-- NOCASE folds only ASCII A-Z; SQLite has no ICU here, so accented or
-- non-Latin letters are still compared byte for byte.
-- The stored value keeps its original spelling: collation affects
-- comparison, not what is written to the row, so the result is 'Ada@x'.
CREATE TABLE users(id INTEGER PRIMARY KEY, email TEXT NOT NULL COLLATE NOCASE UNIQUE);
INSERT INTO users VALUES(1, 'Ada@x');
SELECT id, email
FROM users
ORDER BY id;

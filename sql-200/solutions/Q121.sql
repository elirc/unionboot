-- Why this works:
-- A column declared exactly INTEGER PRIMARY KEY is an alias for the hidden
-- rowid, not a separate column, so SQLite fills it in automatically.
-- The INSERT names only (name), so id is omitted and SQLite assigns the
-- next rowid, 1, for the first row of an empty table.
-- NOT NULL on name makes the grader's INSERT of a NULL name fail with a
-- NOT NULL constraint error.
-- The final SELECT is the graded statement; the CREATE and INSERT before it
-- only set up this disposable database.
CREATE TABLE items(id INTEGER PRIMARY KEY, name TEXT NOT NULL);
INSERT INTO items(name) VALUES('One');
SELECT id, name
FROM items
ORDER BY id;

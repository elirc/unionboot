-- Why this works:
-- CHECK(status IN('draft','live')) is an enumeration: the quoted strings
-- are text literals. Double quotes would be read as identifiers first and
-- SQLite would only fall back to treating them as text.
-- SQLite has no boolean type, so enabled is an INTEGER and the second CHECK
-- restricts it to 0 and 1; storing 2 would otherwise be legal.
-- Both checks are row-level, so each violating INSERT fails on its own with
-- a CHECK constraint error.
CREATE TABLE flags(
  id INTEGER PRIMARY KEY,
  status TEXT NOT NULL CHECK(status IN('draft', 'live')),
  enabled INTEGER NOT NULL CHECK(enabled IN(0, 1))
);
INSERT INTO flags VALUES(1, 'draft', 0), (2, 'live', 1);
SELECT id, status, enabled
FROM flags
ORDER BY id;

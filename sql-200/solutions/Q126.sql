-- Why this works:
-- REFERENCES departments(id) declares the foreign key; the runner has
-- already issued PRAGMA foreign_keys=ON, without which SQLite would parse
-- the clause and then ignore it.
-- ON DELETE RESTRICT refuses to delete a parent row that still has
-- children, so deleting department 10 fails instead of orphaning worker 1.
-- The same constraint works in the other direction: inserting a worker in
-- department 99, which does not exist, also fails.
CREATE TABLE workers(
  id INTEGER PRIMARY KEY,
  dept_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE RESTRICT
);
INSERT INTO workers VALUES(1, 10);
SELECT id, dept_id
FROM workers
ORDER BY id;

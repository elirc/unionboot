-- Why this works:
-- ON DELETE CASCADE is the opposite policy to Q126's RESTRICT: deleting the
-- parent deletes its children instead of refusing.
-- Removing department 10 therefore removes worker 1, and worker 2 survives
-- because its parent, department 20, is untouched.
-- The cascade fires inside the DELETE statement, so the following SELECT
-- already sees the shrunken table.
-- dept_id is nullable here, unlike Q126, but no row uses that.
CREATE TABLE workers(
  id INTEGER PRIMARY KEY,
  dept_id INTEGER REFERENCES departments(id) ON DELETE CASCADE
);
INSERT INTO workers VALUES(1, 10), (2, 20);
DELETE FROM departments WHERE id = 10;
SELECT id, dept_id
FROM workers
ORDER BY id;

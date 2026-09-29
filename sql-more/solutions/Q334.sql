-- Why this works:
-- The graded statement is only a count; the schema does the interesting
-- work, and the test's probe checks it afterwards.
-- tasks declares FOREIGN KEY(tenant, project_id) REFERENCES projects
-- (tenant, id), so a child row is valid only when the whole pair exists in
-- the parent. The probe inserts tenant 2 referring to project 2, which
-- exists only under tenant 1, and SQLite raises
-- FOREIGN KEY constraint failed.
-- A single-column foreign key on project_id would have accepted that row,
-- because project 2 does exist somewhere.
-- The runner sets PRAGMA foreign_keys=ON before seeding; SQLite's own
-- default is off, and an unenforced constraint would let the probe succeed.
-- Nothing here may drop or recreate the tables: the probe runs against the
-- database this statement leaves behind.
SELECT COUNT(*) AS tasks
FROM tasks;

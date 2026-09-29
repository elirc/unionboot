-- Why this works:
-- As in Q334 the graded statement is a count and the schema is the lesson,
-- checked by the test's probe afterwards.
-- projects is declared WITHOUT ROWID, so it is stored as a B-tree keyed by
-- (tenant, id) and has no hidden rowid. In such a table the primary-key
-- columns are NOT NULL, which is why the probe's NULL tenant fails with
-- NOT NULL constraint failed: projects.tenant.
-- An ordinary rowid table does not behave that way: PRIMARY KEY(a,b) there
-- still accepts a NULL in a, a compatibility quirk SQLite documents. The
-- WITHOUT ROWID clause is what closes it.
-- The table must be left intact for the probe to run against.
SELECT COUNT(*) AS projects
FROM projects;

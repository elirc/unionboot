-- Why this works:
-- SQLite keeps its schema in an ordinary table, sqlite_schema, and CREATE
-- TABLE is an ordinary write to it. That makes DDL transactional here, which
-- is not true of every SQL engine.
-- So the CREATE and the INSERT are both undone by ROLLBACK, and the table
-- ceases to exist rather than surviving empty.
-- The graded statement counts rows named temporary_work in sqlite_schema;
-- the answer is 0. Querying the table itself would raise no-such-table and
-- fail as a grading error instead of returning a row.
BEGIN;
CREATE TABLE temporary_work(value INTEGER);
INSERT INTO temporary_work VALUES(1);
ROLLBACK;
SELECT COUNT(*) AS tables_found
FROM sqlite_schema
WHERE type = 'table'
  AND name = 'temporary_work';

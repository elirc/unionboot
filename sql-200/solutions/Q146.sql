BEGIN; CREATE TABLE temporary_work(value INTEGER); INSERT INTO temporary_work VALUES(1); ROLLBACK; SELECT COUNT(*) AS tables_found FROM sqlite_schema WHERE type='table' AND name='temporary_work';

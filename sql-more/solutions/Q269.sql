CREATE TEMP VIEW local_paid AS SELECT * FROM orders WHERE status='paid';SELECT name,type,(SELECT COUNT(*) FROM local_paid) AS rows_count FROM sqlite_temp_schema WHERE name='local_paid';

ALTER TABLE jobs ADD COLUMN attempts INTEGER NOT NULL DEFAULT 0;UPDATE jobs SET attempts=attempts+1 WHERE state='failed';SELECT id,attempts FROM jobs ORDER BY id;

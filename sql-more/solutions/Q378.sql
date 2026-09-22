ALTER TABLE jobs ADD COLUMN priority INTEGER NOT NULL DEFAULT 5;UPDATE jobs SET priority=1 WHERE queue='bulk';SELECT queue,id FROM jobs WHERE state='queued' ORDER BY priority,id LIMIT 1;

UPDATE jobs SET state='running' WHERE queue='mail' AND state='queued';SELECT id,state FROM jobs ORDER BY id;

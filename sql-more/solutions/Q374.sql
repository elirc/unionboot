UPDATE jobs SET state='queued' WHERE queue='mail' AND state='running';SELECT id,state FROM jobs WHERE queue='mail' ORDER BY id;

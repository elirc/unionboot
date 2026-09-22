WITH picked AS(SELECT id FROM jobs WHERE queue='mail' AND state='queued' ORDER BY id LIMIT 2) UPDATE jobs SET state='running' WHERE id IN(SELECT id FROM picked);SELECT id,state FROM jobs ORDER BY id;

UPDATE jobs SET state='done' WHERE id IN(1,2) AND state='running';SELECT id,state FROM jobs WHERE id IN(1,2) ORDER BY id;

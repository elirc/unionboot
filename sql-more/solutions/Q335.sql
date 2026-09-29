-- Why this works:
-- The insert uses task id 2 under tenant 2. Tenant 1 already has a task with
-- id 2, and that is fine: uniqueness is on the pair (tenant, id), not on id.
-- The reference (2, 1) points at tenant 2's own project 1, so the composite
-- foreign key is satisfied.
-- The probe then repeats (2, 2) and must fail with
-- UNIQUE constraint failed: tasks.tenant, tasks.id -- the same composite key
-- that permitted the first insert refuses the second.
-- The final SELECT reports the four (tenant, id) pairs in key order.
INSERT INTO tasks
VALUES (2, 2, 1, 'D');
SELECT tenant,
       id
FROM tasks
ORDER BY tenant, id;

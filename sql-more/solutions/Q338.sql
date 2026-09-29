-- Why this works:
-- A write is scoped by the same key as a read. The row to rename is tenant
-- 2's project 1, so both halves of the key appear in the WHERE clause.
-- WHERE id = 1 alone would also rename tenant 1's Alpha, which the expected
-- first row shows untouched.
-- The final SELECT reports the whole table so the assertion can see both the
-- changed row and the rows that had to stay as they were.
UPDATE projects
SET title = 'Delta'
WHERE tenant = 2
  AND id = 1;
SELECT tenant,
       id,
       title
FROM projects
ORDER BY tenant, id;

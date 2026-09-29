-- Why this works:
-- Keyset pagination remembers the last row of the previous page as a cursor
-- and asks for the rows after it.
-- (tenant, id) > (1, 1) is a row-value comparison and is lexicographic:
-- tenant decides, and id is consulted only when the tenants are equal. So
-- (1,2) and (2,1) both qualify and (1,1) does not.
-- Writing tenant > 1 OR id > 1 instead happens to return the same rows here
-- but is a different predicate: it would also admit a lower tenant with a
-- higher id.
-- ORDER BY must match the cursor's column order, or LIMIT would cut the
-- wrong two rows. LIMIT 2 is the page size.
SELECT tenant,
       id,
       title
FROM projects
WHERE (tenant, id) > (1, 1)
ORDER BY tenant, id
LIMIT 2;

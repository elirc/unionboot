-- Why this works:
-- Under a composite key, id is only unique inside a tenant, so id = 1 is an
-- ambiguous question and both matching projects are expected.
-- No tenant filter appears on purpose: the point of the scenario is that the
-- same id names two different projects, tenant 1's Alpha and tenant 2's
-- Gamma.
-- tenant is therefore projected as part of the identity, not as decoration;
-- without it the two rows would be indistinguishable.
SELECT tenant,
       id,
       title
FROM projects
WHERE id = 1
ORDER BY tenant;

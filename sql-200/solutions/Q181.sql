-- Why this works:
-- ? is a positional parameter. The harness binds the test's params array to
-- the final prepared statement in order, so the first ? is 'office' and the
-- second is 5.
-- The values never appear in the SQL text: node:sqlite sends them
-- separately, so quoting and escaping are not the query's problem.
-- Only Pen (office, 3) satisfies both predicates; Pad is office but costs
-- 12.
SELECT id, name
FROM products
WHERE category = ?
  AND price <= ?
ORDER BY id;

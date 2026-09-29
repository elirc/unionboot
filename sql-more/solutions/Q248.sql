-- Why this works:
-- A composite index is usable left to right: equality on the leading column
-- lets SQLite seek, and the next column can then be scanned as a range.
-- So the plan reads tenant=? AND email>?, an equality prefix followed by one
-- bounded column.
-- SQLite renders the bound as email>? even though the query says >=; the
-- plan records that a lower bound exists, not which operator produced it.
-- INDEXED BY pins the plan so the text does not depend on how the planner
-- costs a three-row table.
CREATE INDEX tenant_email ON users(tenant, email);
EXPLAIN QUERY PLAN
SELECT id
FROM users INDEXED BY tenant_email
WHERE tenant = 10
  AND email >= 'B';

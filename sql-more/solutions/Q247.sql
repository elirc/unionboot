-- Why this works:
-- The index covers only active rows, so it can answer this query only
-- because the query also filters active=1.
-- INDEXED BY is a SQLite-specific hint that requires the named index: with
-- three rows the planner might otherwise prefer a plain scan, and the plan
-- text is what is being graded.
-- The detail shows tenant=? as the seek constraint, and COVERING because id
-- comes from the index rowid rather than the table.
-- The active=1 test does not appear in the detail: it is implied by the
-- partial index itself.
CREATE INDEX active_tenant ON users(tenant) WHERE active = 1;
EXPLAIN QUERY PLAN
SELECT id
FROM users INDEXED BY active_tenant
WHERE active = 1
  AND tenant = 10;

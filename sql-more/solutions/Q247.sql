CREATE INDEX active_tenant ON users(tenant) WHERE active=1;EXPLAIN QUERY PLAN SELECT id FROM users INDEXED BY active_tenant WHERE active=1 AND tenant=10;

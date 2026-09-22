CREATE INDEX tenant_email ON users(tenant,email);EXPLAIN QUERY PLAN SELECT id FROM users INDEXED BY tenant_email WHERE tenant=10 AND email>='B';

CREATE INDEX tenant_email ON users(tenant ASC,email DESC);SELECT name,desc AS descending FROM pragma_index_xinfo('tenant_email') WHERE key=1 ORDER BY seqno;

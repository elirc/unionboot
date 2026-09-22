CREATE INDEX normalized ON users(lower(email));EXPLAIN QUERY PLAN SELECT id FROM users WHERE lower(email)='ada@x';

CREATE UNIQUE INDEX active_email ON users(lower(email)) WHERE active=1;SELECT id FROM users WHERE active=0 ORDER BY id;

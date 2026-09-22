CREATE UNIQUE INDEX active_email ON users(lower(email)) WHERE active=1;SELECT id,email FROM users WHERE active=1 ORDER BY id;

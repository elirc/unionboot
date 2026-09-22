CREATE UNIQUE INDEX scoped ON users(tenant,lower(email)) WHERE active=1;INSERT INTO users VALUES(4,'ADA@X',1,20);SELECT id FROM users WHERE active=1 ORDER BY id;

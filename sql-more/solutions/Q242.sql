-- Why this works:
-- Adding a leading column to the key changes the scope of the rule: the pair
-- tenant plus normalized email must be unique, not the email alone.
-- So the new active ADA@X in tenant 20 is accepted, because tenant 20 has
-- no other row normalizing to ada@x.
-- The integrity probe then tries the same address as an active row in
-- tenant 10, where id 1 already holds that key, and is rejected.
-- The WHERE active=1 clause still limits the whole rule to active rows.
CREATE UNIQUE INDEX scoped ON users(tenant, lower(email)) WHERE active = 1;
INSERT INTO users
VALUES (4, 'ADA@X', 1, 20);
SELECT id
FROM users
WHERE active = 1
ORDER BY id;

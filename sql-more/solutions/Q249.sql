-- Why this works:
-- This is the same active-only unique index as the first scenario, seen from
-- the other side: the graded rows are the inactive users.
-- Row 2 is outside the index while it is inactive, so it may hold the same
-- normalized address as row 1.
-- The integrity probe then activates row 2, which does not merely change a
-- column but moves the row into the index scope, where the key ada@x is
-- already taken; SQLite rejects the UPDATE.
-- A partial unique index therefore constrains transitions into its scope,
-- not only inserts.
CREATE UNIQUE INDEX active_email ON users(lower(email)) WHERE active = 1;
SELECT id
FROM users
WHERE active = 0
ORDER BY id;

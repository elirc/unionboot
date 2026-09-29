-- Why this works:
-- A UNIQUE index is how SQLite enforces uniqueness, and a WHERE clause on
-- the index makes that rule apply to only the rows it selects.
-- Here only active rows are indexed, so id 2 keeps the same address as id 1
-- without colliding, which is exactly the soft-delete policy wanted.
-- Indexing lower(email) rather than email makes the rule case-insensitive,
-- so the probe inserting ADA@X as active collides with id 1.
-- The graded SELECT reads the table, so it returns the stored spelling
-- Ada@x rather than the normalized index key.
CREATE UNIQUE INDEX active_email ON users(lower(email)) WHERE active = 1;
SELECT id,
       email
FROM users
WHERE active = 1
ORDER BY id;

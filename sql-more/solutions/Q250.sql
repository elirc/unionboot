-- Why this works:
-- DROP INDEX removes only the index structure; the table rows it was built
-- from are untouched, so users still counts 3.
-- sqlite_schema is the catalogue table that holds one row per schema object,
-- so counting rows with type='index' and the dropped name proves the index
-- is gone rather than relying on an error.
-- That count is written as a scalar subquery so that both numbers arrive in
-- one row with the required aliases.
-- The outer COUNT(*) runs over users, which is what makes the first column
-- the surviving row count.
CREATE INDEX normalized ON users(lower(email));
DROP INDEX normalized;
SELECT COUNT(*) AS users,
       (SELECT COUNT(*)
        FROM sqlite_schema
        WHERE type = 'index'
          AND name = 'normalized') AS indexes
FROM users;

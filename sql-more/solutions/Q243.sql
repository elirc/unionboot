-- Why this works:
-- pragma_index_list is the table-valued form of PRAGMA index_list, so it can
-- be queried like any other table.
-- Its unique column is 0 here because the index was created without the
-- UNIQUE keyword, and its partial column is 1 because the definition has a
-- WHERE clause.
-- unique is a reserved word in SQL, so it has to be written in double quotes
-- before it can be aliased.
-- Filtering by name keeps the row stable if other indexes exist.
CREATE INDEX active_only ON users(email) WHERE active = 1;
SELECT name,
       "unique" AS is_unique,
       partial
FROM pragma_index_list('users')
WHERE name = 'active_only';

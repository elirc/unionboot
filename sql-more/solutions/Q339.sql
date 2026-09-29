-- Why this works:
-- pragma_foreign_key_list is a table-valued pragma function: it can be used
-- in a FROM clause and returns one row per column of each foreign key on the
-- named table.
-- seq is that column's position inside the key, so ordering by it shows the
-- mapping as an ordered pair: tenant to tenant, then project_id to id.
-- from and to are the child and parent column names. Both words are SQL
-- keywords, so they have to be written as "from" and "to" in double quotes
-- to be read as identifiers; the aliases then give them the graded names.
-- Two rows with the same key id is what makes this foreign key composite.
SELECT seq,
       "from" AS child_column,
       "to" AS parent_column
FROM pragma_foreign_key_list('tasks')
ORDER BY seq;

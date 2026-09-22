SELECT seq,"from" AS child_column,"to" AS parent_column FROM pragma_foreign_key_list('tasks') ORDER BY seq;

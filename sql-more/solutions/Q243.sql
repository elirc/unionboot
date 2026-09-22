CREATE INDEX active_only ON users(email) WHERE active=1;SELECT name,"unique" AS is_unique,partial FROM pragma_index_list('users') WHERE name='active_only';

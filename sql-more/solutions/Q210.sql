-- Why this works:
-- json_extract changes its return shape when it is given more than one path:
-- instead of a single SQL value it renders a JSON array as text.
-- So one call with '$.name' and '$.city' produces ["Ada",null] for Ada,
-- with the absent city of Bo also written as null inside the array.
-- Building the array by hand with || would be fragile, because concatenating
-- anything with NULL yields NULL in SQLite and would blank the whole value.
SELECT id,
       json_extract(body, '$.name', '$.city') AS pair
FROM docs
ORDER BY id;

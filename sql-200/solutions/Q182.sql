-- Why this works:
-- $category is a named parameter. The harness passes an object rather than
-- an array, and node:sqlite matches the object's keys to the names in the
-- SQL, so order no longer matters.
-- Named parameters are worth the extra typing when the same value is used
-- twice, or when a long list of ? marks would be easy to misorder.
-- SQLite accepts :name, @name and $name; this pack binds with the $ form.
SELECT id, name, price
FROM products
WHERE category = $category
ORDER BY id;

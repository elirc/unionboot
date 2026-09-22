-- Why this works:
-- The bound value is the plain JavaScript string O'Brien pen. It is not
-- SQL text, so it needs no doubled apostrophe and must not be wrapped in
-- quotes: a bound "'O''Brien pen'" would be searched for literally,
-- quotes and all.
-- The seed stores the row with 'O''Brien pen' because there the apostrophe
-- is inside a SQL literal and doubling is how SQLite escapes it.
-- That contrast is the point of the exercise: escaping is a property of SQL
-- text, and a parameter is never SQL text.
SELECT id, name
FROM products
WHERE name = ?
ORDER BY id;

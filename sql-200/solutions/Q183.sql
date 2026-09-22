-- Why this works:
-- The whole LIKE pattern is the bound value, 'P%', not a fragment glued to
-- a literal. Building "LIKE '" || ? || "%'" in SQL text is exactly the
-- interpolation this family exists to avoid.
-- % is a wildcard inside the pattern on purpose here, so it is not escaped;
-- Q108 shows the opposite case, where ESCAPE makes a wildcard literal.
-- LIKE is case-insensitive for ASCII in SQLite, so 'P%' would also match a
-- lower-case p; no such row exists in the seed.
SELECT id, name
FROM products
WHERE name LIKE ?
ORDER BY id;

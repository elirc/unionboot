-- Why this works:
-- LIMIT and OFFSET accept bound values, so pagination needs no string
-- building at all.
-- The binding order follows the order the ? marks appear in the text:
-- 'home', then LIMIT 1, then OFFSET 1.
-- OFFSET counts rows skipped, so offset 1 with page size 1 is the second
-- row. The home products by price are Mug 8, Lamp 20, Rug 50, so page 2 is
-- Lamp.
-- ORDER BY is what makes paging meaningful; without it LIMIT would pick an
-- arbitrary row.
SELECT id, name
FROM products
WHERE category = ?
ORDER BY price
LIMIT ?
OFFSET ?;

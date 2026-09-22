-- Why this works:
-- A parameter may be used in a WHERE clause under an aggregate just like
-- any literal; nothing about binding changes how grouping works.
-- With no GROUP BY, MIN returns one row for the whole filtered set, so the
-- result is a single row even though three products match.
-- If the bound category matched nothing, MIN would return NULL and the
-- query would still return one row - an empty result and a NULL result are
-- different outcomes.
SELECT MIN(price) AS cheapest
FROM products
WHERE category = ?;

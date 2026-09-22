-- Why this works:
-- Two bound values with different jobs: the first is compared inside a
-- conditional aggregate, the second filters the rows the aggregates see.
-- The ? marks bind in the order they appear in the text, so params are
-- (10,'home') - the threshold first, even though the WHERE clause reads
-- last.
-- SUM(price) over the three home products is 8+20+50 = 78, and the CASE
-- counts the two of them that cost more than 10.
-- Both numbers come from one pass over the same filtered rows.
SELECT SUM(price) AS total,
       SUM(CASE WHEN price > ? THEN 1 ELSE 0 END) AS expensive
FROM products
WHERE category = ?;

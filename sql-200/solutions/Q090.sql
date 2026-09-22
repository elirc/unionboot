-- Why this works:
-- An aggregate query with no GROUP BY collapses the whole table to exactly
-- one summary row, which is why no ORDER BY is needed.
-- SUM(CASE WHEN cond THEN 1 ELSE 0 END) is the counting idiom: it adds one
-- per matching row. COUNT of that CASE would count 6, because COUNT counts
-- non-NULL results and 0 is not NULL.
-- COUNT(a) is the third column: it counts rows whose a is not NULL, giving
-- the four known values.
-- The three counts deliberately overlap, since a zero is also a known value.
SELECT SUM(CASE WHEN a IS NULL THEN 1 ELSE 0 END) AS missing,
       SUM(CASE WHEN a = 0 THEN 1 ELSE 0 END) AS zeros,
       COUNT(a) AS known
FROM measures;

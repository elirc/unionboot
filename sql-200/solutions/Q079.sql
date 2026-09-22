-- Why this works:
-- UNION ALL first, so the CTE is a multiset of all nine rows with every
-- duplicate intact; UNION would have thrown away the counts being measured.
-- GROUP BY then buckets by value. Like the set operators, GROUP BY treats
-- NULLs as one group rather than as distinct unknowns, so the three NULL
-- rows form a single bucket.
-- COUNT(*) counts rows in the bucket. COUNT(name) would report 0 for the
-- NULL group, because it counts only non-NULL values.
WITH both AS (
  SELECT name FROM spring
  UNION ALL
  SELECT name FROM autumn
)
SELECT name,
       COUNT(*) AS occurrences
FROM both
GROUP BY name
ORDER BY name;

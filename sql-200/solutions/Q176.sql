-- Why this works:
-- The group key is the pair (name,email) with no normalization, so matching
-- uses the default BINARY collation: 'Ada' and 'ada' are different names
-- and do not form a duplicate.
-- Only the two 'Bo'/'bo@x.com' rows are byte-identical on both columns, so
-- one group survives HAVING COUNT(*)>1.
-- Grouping by a column pair means both values are reportable, unlike a
-- grouping by an expression.
SELECT name,
       email,
       COUNT(*) AS copies
FROM raw
GROUP BY name, email
HAVING COUNT(*) > 1
ORDER BY email, name;

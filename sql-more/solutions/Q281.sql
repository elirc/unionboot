-- Why this works:
-- An as-of query asks which version was in force at one point, which under
-- half-open validity is valid_from <= p and p < valid_to.
-- A NULL valid_to marks the still-current version, and NULL > 1 is unknown
-- rather than true, so that case is spelled out with OR valid_to IS NULL.
-- Only A's first version covers day 1. B's history does not start until day
-- 2, so B contributes no row at all, and that absence is the answer rather
-- than a missing value to fill in.
SELECT sku,
       price
FROM prices
WHERE valid_from <= 1
  AND (valid_to > 1 OR valid_to IS NULL)
ORDER BY sku;

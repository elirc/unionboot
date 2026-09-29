-- Why this works:
-- The predicate is unchanged; only the as-of point moves to day 6.
-- A's middle version runs from 4 to 8 and still covers it.
-- B's history has a hole: one version ends at 6 and the next does not begin
-- until 7, so no B version satisfies both comparisons.
-- Strict interval membership therefore reports no B price at all, rather
-- than carrying the expired price forward across the gap.
-- Whether a gap should be filled is a policy decision, and this scenario
-- chooses absence.
SELECT sku,
       price
FROM prices
WHERE valid_from <= 6
  AND (valid_to > 6 OR valid_to IS NULL)
ORDER BY sku;

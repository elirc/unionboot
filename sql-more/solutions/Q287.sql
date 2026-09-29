-- Why this works:
-- Each version contributes its price for as long as it overlaps the window,
-- so the term is price multiplied by the clipped length.
-- MIN and MAX with two arguments are scalar, so the clip happens per row
-- and SUM then aggregates the terms within each SKU.
-- COALESCE replaces an open valid_to with the window end before the
-- arithmetic, because the scalar MIN would otherwise propagate NULL.
-- The outer MAX(0,...) clamps versions that lie entirely outside the window
-- to zero instead of letting a negative length subtract from the total.
-- A contributes 2 days at 10 and 2 days at 12, which is 44; B contributes 4
-- days at 7, which is 28.
SELECT sku,
       SUM(price * MAX(0, MIN(COALESCE(valid_to, 6), 6) - MAX(valid_from, 2))) AS price_days
FROM prices
GROUP BY sku
ORDER BY sku;

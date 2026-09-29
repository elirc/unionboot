-- Why this works:
-- The carry-forward policy asks for the most recent version that had started
-- by the as-of point, and deliberately never looks at valid_to.
-- The correlated subquery finds that latest start per SKU, and the outer row
-- is kept when its own valid_from equals it.
-- The correlation x.sku = p.sku is essential: without it the subquery would
-- return the latest start across all SKUs and at most one row would match.
-- Because valid_to is ignored, B's expired version is reported for day 6
-- even though the strict reading finds a gap there.
SELECT p.sku,
       p.price
FROM prices p
WHERE p.valid_from = (SELECT MAX(x.valid_from)
                      FROM prices x
                      WHERE x.sku = p.sku
                        AND x.valid_from <= 6)
ORDER BY p.sku;

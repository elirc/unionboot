-- Why this works:
-- The accumulate policy needs both sides of the conflict: inventory.qty is
-- the stored value (5) and excluded.qty is the incoming one (3), so the sum
-- is 8.
-- Qualifying with the table name is what distinguishes the two; a bare qty
-- on the right-hand side would resolve to the stored row and silently make
-- this a no-op doubling bug.
-- price and version are left out of SET and so are preserved.
INSERT INTO inventory VALUES('A', 3, 99, 9)
  ON CONFLICT(sku) DO UPDATE
    SET qty = inventory.qty + excluded.qty;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

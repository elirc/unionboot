-- Why this works:
-- The INSERT carries two rows, and the conflict policy is applied per row:
-- 'A' collides and 'B' collides, each running the same DO UPDATE.
-- MAX with two arguments is the scalar function, not the aggregate: it
-- returns the larger of the stored and incoming quantities. A keeps 5
-- because 5 > 3; B moves to 4 because 4 > 0.
-- price and version stay as stored, so the incoming 99 and 9 are discarded.
INSERT INTO inventory VALUES('A', 3, 99, 9), ('B', 4, 99, 9)
  ON CONFLICT(sku) DO UPDATE
    SET qty = MAX(inventory.qty, excluded.qty);
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

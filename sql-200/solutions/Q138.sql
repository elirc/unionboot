-- Why this works:
-- Two different merge rules in one SET list. Price keeps the cheaper of the
-- stored 10 and the incoming 8 with the scalar MIN function.
-- Version is not taken from excluded at all: inventory.version+1 bumps the
-- stored 2 to 3, so the row number reflects how many times the row changed
-- rather than what the caller claimed.
-- qty is absent from SET, so the incoming 100 is discarded and 5 survives.
INSERT INTO inventory VALUES('A', 100, 8, 50)
  ON CONFLICT(sku) DO UPDATE
    SET price = MIN(inventory.price, excluded.price),
        version = inventory.version + 1;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

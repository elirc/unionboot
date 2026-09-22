-- Why this works:
-- Same optimistic-concurrency guard as Q136, but the incoming version is 1
-- and the stored version is 2, so excluded.version>inventory.version is
-- false and the DO UPDATE does nothing.
-- The statement still succeeds: a DO UPDATE whose WHERE is false is not an
-- error, which is what makes this a usable "reject stale writes" pattern.
-- The stored row keeps qty 5, price 10 and version 2.
INSERT INTO inventory VALUES('A', 7, 12, 1)
  ON CONFLICT(sku) DO UPDATE
    SET qty = excluded.qty,
        price = excluded.price,
        version = excluded.version
    WHERE excluded.version > inventory.version;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

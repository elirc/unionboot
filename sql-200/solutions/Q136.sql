-- Why this works:
-- DO UPDATE accepts its own WHERE clause, evaluated after the conflict is
-- detected. When it is false the update is skipped and, like DO NOTHING,
-- no error is raised.
-- The guard excluded.version>inventory.version implements
-- last-writer-wins-by-version: incoming version 3 beats stored 2, so all
-- three columns are adopted.
-- Q137 is byte-for-byte the same statement with a stale incoming version,
-- and the guard blocks it there.
INSERT INTO inventory VALUES('A', 7, 12, 3)
  ON CONFLICT(sku) DO UPDATE
    SET qty = excluded.qty,
        price = excluded.price,
        version = excluded.version
    WHERE excluded.version > inventory.version;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

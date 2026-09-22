-- Why this works:
-- The source of the INSERT is a SELECT, so the whole incoming table is
-- merged in one statement: 'A' conflicts and is replaced, 'C' is new and is
-- inserted.
-- WHERE true is required, not decoration. After a SELECT, SQLite's parser
-- cannot tell whether ON belongs to a join or starts ON CONFLICT, so the
-- SELECT must end in a WHERE clause; WHERE true keeps every source row.
-- excluded here means the row produced by the SELECT for this conflict.
INSERT INTO inventory
  SELECT sku, qty, price, version
  FROM incoming
  WHERE true
  ON CONFLICT(sku) DO UPDATE
    SET qty = excluded.qty,
        price = excluded.price,
        version = excluded.version;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

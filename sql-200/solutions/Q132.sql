-- Why this works:
-- 'A' already exists, so the unique index on sku raises a conflict and the
-- DO NOTHING branch runs: the incoming row is discarded and the stored row
-- is left exactly as it was.
-- Without the ON CONFLICT clause the statement would abort with a UNIQUE
-- constraint error and the whole submission would fail.
-- INSERT OR REPLACE would be a different policy again: it deletes the old
-- row and inserts the new one.
INSERT INTO inventory VALUES('A', 99, 99, 99)
  ON CONFLICT(sku) DO NOTHING;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

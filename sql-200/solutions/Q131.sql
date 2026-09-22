-- Why this works:
-- ON CONFLICT(sku) names the conflict target: the unique index the INSERT
-- must watch. SKU 'C' is absent, so no conflict happens and the row is
-- inserted normally.
-- DO NOTHING is therefore never reached; it is the policy for the case that
-- does not occur here, and Q132 is the same statement on a key that does
-- collide.
-- The following SELECT is the graded statement and reports the whole table.
INSERT INTO inventory VALUES('C', 3, 30, 1)
  ON CONFLICT(sku) DO NOTHING;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

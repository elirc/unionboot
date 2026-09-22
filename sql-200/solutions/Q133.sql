-- Why this works:
-- DO UPDATE turns the conflict into an UPDATE of the stored row. Inside it,
-- excluded is a pseudo-table holding the row that would have been inserted.
-- SET qty=excluded.qty copies only the incoming quantity, so price and
-- version keep their stored values 10 and 2 and the incoming 99 and 9 are
-- ignored.
-- Any column not listed in SET is untouched; that is the whole difference
-- between this variant and a wholesale replace.
INSERT INTO inventory VALUES('A', 3, 99, 9)
  ON CONFLICT(sku) DO UPDATE
    SET qty = excluded.qty;
SELECT sku, qty, price, version
FROM inventory
ORDER BY sku;

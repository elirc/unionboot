-- Why this works:
-- The derived value is defined, not stored by hand, so changing a base
-- column is the whole update: total follows automatically.
-- Setting qty to 4 on row 1 makes total 4*10 = 40 with no second write, and
-- writing to total directly would be rejected anyway.
-- The other two rows are untouched and keep their original products.
-- AS(qty*price) with no keyword means VIRTUAL, so the new value is computed
-- at read time from the updated qty.
CREATE TABLE calc(
  id INTEGER PRIMARY KEY,
  qty INTEGER,
  price INTEGER,
  total INTEGER AS (qty*price)
);
INSERT INTO calc(id, qty, price)
SELECT id,
       qty,
       price
FROM source;
UPDATE calc
SET qty = 4
WHERE id = 1;
SELECT id,
       total
FROM calc
ORDER BY id;

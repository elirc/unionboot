-- Why this works:
-- STORED means the derived value is computed once, at insert time, and
-- written into the row, rather than recomputed on every read.
-- The expression subtracts discount, so this table copies all four base
-- columns and SELECT * lines up with the four writable columns.
-- Nothing in the result reveals the storage policy: STORED and VIRTUAL give
-- identical answers and differ only in where the cost falls.
-- Row 2 nets to 0 because both qty and discount are 0, which is a real
-- value and not a missing one.
CREATE TABLE calc(
  id INTEGER PRIMARY KEY,
  qty INTEGER,
  price INTEGER,
  discount INTEGER,
  net INTEGER GENERATED ALWAYS AS (qty*price-discount) STORED
);
INSERT INTO calc(id, qty, price, discount)
SELECT *
FROM source;
SELECT id,
       net
FROM calc
ORDER BY id;

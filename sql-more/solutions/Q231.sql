-- Why this works:
-- A generated column is declared with an expression instead of a value, so
-- total is never written; SQLite computes qty*price when it is read.
-- VIRTUAL means nothing is stored on disk for total, which is the cheapest
-- choice when the value is only projected and never indexed.
-- The INSERT names only the base columns: naming total would raise
-- cannot INSERT into generated column.
-- discount is deliberately not copied, because this scenario reports the
-- gross line total.
CREATE TABLE calc(
  id INTEGER PRIMARY KEY,
  qty INTEGER,
  price INTEGER,
  total INTEGER GENERATED ALWAYS AS (qty*price) VIRTUAL
);
INSERT INTO calc(id, qty, price)
SELECT id,
       qty,
       price
FROM source;
SELECT id,
       total
FROM calc
ORDER BY id;

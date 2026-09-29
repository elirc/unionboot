-- Why this works:
-- A generated column may be defined in terms of an earlier generated column,
-- so the two derivations form a chain inside one table.
-- gross is qty*price and net subtracts discount from gross, which keeps the
-- definition of gross in exactly one place.
-- Declaration order matters: gross must come before net, because a forward
-- reference is rejected when the table is created.
-- Both are VIRTUAL, so each read evaluates the chain from the base columns.
CREATE TABLE calc(
  id INTEGER PRIMARY KEY,
  qty INTEGER,
  price INTEGER,
  discount INTEGER,
  gross INTEGER AS (qty*price),
  net INTEGER AS (gross-discount)
);
INSERT INTO calc(id, qty, price, discount)
SELECT *
FROM source;
SELECT id,
       gross,
       net
FROM calc
ORDER BY id;

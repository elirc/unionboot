-- Why this works:
-- A CHECK may reference a generated column, which moves the invariant into
-- the schema so every writer is bound by it.
-- net is STORED, so it is computed at insert time and the CHECK sees a real
-- value rather than NULL.
-- All three seeded rows satisfy net>=0, so they load and report 17, 0, 19.
-- The integrity probe then inserts a line whose discount exceeds the gross
-- amount, and SQLite raises CHECK constraint failed: net>=0.
-- An ordinary column would not do: an unwritten plain net would be NULL, and
-- a CHECK that evaluates to unknown counts as satisfied.
CREATE TABLE calc(
  id INTEGER PRIMARY KEY,
  qty INTEGER,
  price INTEGER,
  discount INTEGER,
  net INTEGER AS (qty*price-discount) STORED CHECK(net >= 0)
);
INSERT INTO calc(id, qty, price, discount)
SELECT *
FROM source;
SELECT id,
       net
FROM calc
ORDER BY id;

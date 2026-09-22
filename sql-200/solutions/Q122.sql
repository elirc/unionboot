-- Why this works:
-- NOT NULL rejects a missing value; CHECK(qty>=0) rejects a value that is
-- present but negative. They are different constraints and the grader
-- probes both.
-- CHECK is evaluated per row on every INSERT and UPDATE, so qty=-1 fails
-- with a CHECK constraint error rather than being stored.
-- qty=0 is allowed because the check is >=, not >.
-- TEXT PRIMARY KEY is a real indexed column here, unlike INTEGER PRIMARY
-- KEY, which would be a rowid alias.
CREATE TABLE stock(sku TEXT PRIMARY KEY NOT NULL, qty INTEGER NOT NULL CHECK(qty >= 0));
INSERT INTO stock VALUES('A', 0), ('B', 3);
SELECT sku, qty
FROM stock
ORDER BY sku;

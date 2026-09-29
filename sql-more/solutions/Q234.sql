-- Why this works:
-- The graded rows come from a single literal insert, but the point of the
-- scenario is the constraint the schema creates.
-- total is generated, so SQLite refuses any direct assignment to it: the
-- integrity probe runs UPDATE calc SET total=9 afterwards and requires an
-- error message containing generated column.
-- That is why total must stay a generated column here rather than an
-- ordinary column filled in by the insert.
-- One row in the table means no ORDER BY is needed.
CREATE TABLE calc(
  id INTEGER PRIMARY KEY,
  qty INTEGER,
  price INTEGER,
  total INTEGER AS (qty*price)
);
INSERT INTO calc(id, qty, price)
VALUES (1, 2, 10);
SELECT id,
       total
FROM calc;

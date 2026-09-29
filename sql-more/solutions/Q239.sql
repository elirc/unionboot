-- Why this works:
-- CREATE TABLE AS SELECT copies both the shape and the rows of source, so
-- calc starts as a plain three-row table with no derived column.
-- ALTER TABLE ADD COLUMN can then add a VIRTUAL generated column, because a
-- virtual column stores nothing and so needs no backfill of existing rows.
-- The same statement with STORED is refused on a populated table with
-- cannot add a STORED column.
-- Reading total afterwards evaluates qty*price for each copied row.
CREATE TABLE calc AS
SELECT *
FROM source;
ALTER TABLE calc
  ADD COLUMN total INTEGER AS (qty*price) VIRTUAL;
SELECT id,
       total
FROM calc
ORDER BY id;

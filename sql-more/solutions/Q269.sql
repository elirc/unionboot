-- Why this works:
-- A TEMP object belongs to a separate schema that lives only for the
-- connection, so it is not listed in sqlite_schema at all.
-- sqlite_temp_schema is the catalogue for that schema, and it reports the
-- view with type 'view'.
-- The temporary view is still an ordinary view otherwise: reading it runs
-- its definition against orders and finds the two paid rows.
-- That count is taken in a scalar subquery so the catalogue row and the row
-- count arrive together in one result row.
CREATE TEMP VIEW local_paid AS
SELECT *
FROM orders
WHERE status = 'paid';
SELECT name,
       type,
       (SELECT COUNT(*)
        FROM local_paid) AS rows_count
FROM sqlite_temp_schema
WHERE name = 'local_paid';

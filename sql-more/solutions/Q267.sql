-- Why this works:
-- DROP VIEW removes a definition, and a view never held any rows, so there
-- is nothing to lose: orders still counts 4.
-- Existence is proved by counting catalogue rows rather than by provoking an
-- error, so the query stays a plain SELECT.
-- sqlite_schema holds one row per schema object, so a count of rows named
-- paid_orders is 0 once the view is gone.
-- The catalogue count is written as a scalar subquery so both numbers
-- arrive in a single row with the required aliases.
CREATE VIEW paid_orders AS
SELECT *
FROM orders
WHERE status = 'paid';
DROP VIEW paid_orders;
SELECT COUNT(*) AS orders,
       (SELECT COUNT(*)
        FROM sqlite_schema
        WHERE name = 'paid_orders') AS views
FROM orders;

-- Why this works:
-- all_orders is a pass-through view, so reading it returns all four base
-- rows and the count is 4.
-- The point of the scenario is what happens next: SQLite views are
-- read-only, so the integrity probe's INSERT fails with a message saying
-- the object cannot be modified because it is a view.
-- Writes to a view are possible only through an INSTEAD OF trigger, which
-- this scenario deliberately does not create.
-- A CREATE TABLE AS copy would return the same count and then accept the
-- insert, which is exactly what the probe rules out.
CREATE VIEW all_orders AS
SELECT *
FROM orders;
SELECT COUNT(*) AS count
FROM all_orders;

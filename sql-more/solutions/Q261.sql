-- Why this works:
-- A view is a named query stored in the schema, not a copy of the rows, so
-- creating it computes nothing.
-- The definition carries both halves of the contract: the WHERE selects the
-- paid rows and the select list fixes the three exposed columns.
-- SELECT * in the outer query therefore expands to the view's columns, not
-- to the four columns of orders; status is not reachable through the view.
-- ORDER BY belongs in the caller, so different readers may order the same
-- view differently.
CREATE VIEW paid_orders AS
SELECT id,
       customer,
       amount
FROM orders
WHERE status = 'paid';
SELECT *
FROM paid_orders
ORDER BY id;

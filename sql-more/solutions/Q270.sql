-- Why this works:
-- The view projects two of the four columns, so a caller reading
-- public_orders sees ids and statuses and cannot reach customer or amount
-- through that name.
-- There is no filter, so all four rows appear: this scenario is about the
-- select list, not about row selection.
-- The projection is an interface, not a permission. Any connection that can
-- read the view can also read orders directly, so nothing here restricts
-- access to the hidden columns.
-- Real column-level restriction needs a mechanism outside the database.
CREATE VIEW public_orders AS
SELECT id,
       status
FROM orders;
SELECT *
FROM public_orders
ORDER BY id;

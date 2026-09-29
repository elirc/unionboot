-- Why this works:
-- A column list written after the view name renames the result columns
-- positionally, so the bare SUM(amount) becomes total and customer becomes
-- person.
-- That is the alternative to aliasing inside the body, and it documents the
-- view's shape in one place at the top.
-- There is no WHERE here, so every status is aggregated: Ada's paid 10 and
-- pending 20 add up to 30.
-- The columns are then selected by their view names, not by the underlying
-- expressions.
CREATE VIEW totals(person, total) AS
SELECT customer,
       SUM(amount)
FROM orders
GROUP BY customer;
SELECT person,
       total
FROM totals
ORDER BY person;

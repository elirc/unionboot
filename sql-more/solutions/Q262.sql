-- Why this works:
-- The aggregation lives inside the view, so callers ask for revenue rather
-- than remembering both the filter and the GROUP BY.
-- The WHERE runs before the grouping, so Ada's pending order of 20 never
-- reaches the sum and her total is 10.
-- SUM(amount) is aliased to total inside the definition; without a name the
-- view's column would be called SUM(amount) and callers would have to quote
-- it.
-- The alphabetical order is supplied by the outer query.
CREATE VIEW revenue AS
SELECT customer,
       SUM(amount) AS total
FROM orders
WHERE status = 'paid'
GROUP BY customer;
SELECT *
FROM revenue
ORDER BY customer;

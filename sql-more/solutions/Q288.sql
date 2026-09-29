-- Why this works:
-- Every order must appear, even one placed during a price gap, so the join
-- is a LEFT JOIN driven by orders.
-- The as-of predicate belongs in the ON clause: there it decides what counts
-- as a matching price version and still preserves the order row.
-- The same predicate in WHERE would be unknown for the unmatched order and
-- would delete it, turning four rows into three.
-- Order 3 falls in B's gap between day 6 and day 7, so no version matches
-- and its price column is NULL.
-- Order 2 sits on A's changeover day and picks the replacement version,
-- because valid_to is exclusive.
SELECT o.id,
       p.price
FROM orders o
LEFT JOIN prices p
  ON p.sku = o.sku
 AND p.valid_from <= o.day
 AND (p.valid_to > o.day OR p.valid_to IS NULL)
ORDER BY o.id;

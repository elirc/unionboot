-- Why this works:
-- This is a semi-join: the question asks which customers have at least one
-- matching line, not how many, so the joins are only used as an existence
-- test and DISTINCT removes the duplicates they create.
-- Bo's paid order carries two office lines, so without DISTINCT the result
-- would list Bo twice.
-- Both restrictions are plain row filters on matched data, so WHERE is right
-- and no customer needs preserving.
SELECT DISTINCT c.id,
       c.name
FROM customers c
JOIN orders o ON o.customer_id = c.id
JOIN lines l ON l.order_id = o.id
JOIN products p ON p.id = l.product_id
WHERE o.status = 'paid'
  AND p.category = 'office'
ORDER BY c.id;

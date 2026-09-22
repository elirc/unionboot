-- Why this works:
-- The outer query reads customers only; the subquery answers "is there at
-- least one paid line for this customer" and NOT EXISTS keeps the ones where
-- the answer is no.
-- Correlation is the c.id reference inside the subquery: it is re-evaluated
-- for each candidate customer.
-- SELECT 1 is idiomatic because EXISTS only cares whether a row is produced,
-- never about its contents.
-- NOT EXISTS is preferred to NOT IN here because a NULL customer_id would
-- make NOT IN unknown for every row and return nothing at all.
SELECT c.name
FROM customers c
WHERE NOT EXISTS (
        SELECT 1
        FROM orders o
        JOIN lines l ON l.order_id = o.id
        WHERE o.customer_id = c.id
          AND o.status = 'paid'
      )
ORDER BY c.id;

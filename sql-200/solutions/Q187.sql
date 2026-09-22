-- Why this works:
-- Both the amount to add and the row to touch are bound, so the statement
-- text is fixed regardless of the request.
-- Binding order is textual: the ? in SET comes first, so params are (2,2) -
-- add 2, to id 2 - and reversing them would silently update a different row.
-- RETURNING makes this UPDATE the final, graded statement and reports the
-- post-update price, 10. Exactly one row is matched, so the unspecified
-- ordering of multi-row RETURNING output does not arise.
UPDATE products
   SET price = price + ?
 WHERE id = ?
RETURNING id, price;

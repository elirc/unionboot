-- Why this works:
-- IN tests membership in the value list the subquery returns, which here is
-- the set of employee ids carrying a strictly positive bonus: 1, 4, and the
-- NULL from the orphan (NULL,99) row, whose amount is also positive.
-- A NULL inside an IN list is harmless. A match still evaluates to true, so
-- Ada and Dee are returned; the others are unknown rather than false, which
-- WHERE treats the same way. Only NOT IN would be poisoned by that NULL.
-- WHERE amount>0 is what excludes Cy, whose single bonus is 0.
-- Ada has two qualifying rows; IN does not duplicate the outer row.
SELECT name
FROM employees
WHERE id IN (SELECT employee_id
             FROM bonuses
             WHERE amount > 0)
ORDER BY id;

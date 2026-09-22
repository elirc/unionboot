-- Why this works:
-- The derived table aggregates bonuses once, producing at most one row per
-- employee_id, so the LEFT JOIN below cannot multiply employees the way a
-- join straight to bonuses would multiply Ada.
-- LEFT JOIN keeps all six employees; the three with no bonus row get NULL for
-- b.total, and COALESCE turns that into the 0 the prompt asks for.
-- The bonuses row with a NULL employee_id forms its own group inside the
-- derived table and then matches no employee, so it is discarded.
SELECT e.name,
       COALESCE(b.total, 0) AS bonus
FROM employees e
LEFT JOIN (SELECT employee_id,
                  SUM(amount) AS total
           FROM bonuses
           GROUP BY employee_id) b ON b.employee_id = e.id
ORDER BY e.id;

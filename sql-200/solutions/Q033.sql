-- Why this works:
-- The question is existence, not value, so EXISTS is the right tool: it stops
-- at the first matching bonus row and never inspects what was selected, which
-- is why SELECT 1 is idiomatic.
-- Ada has two bonus rows but appears once, because EXISTS cannot multiply the
-- outer row the way a join would.
-- No filter on amount: the prompt counts a zero bonus as a bonus, so Cy's
-- amount of 0 still qualifies.
-- The bonuses row with a NULL employee_id matches nobody, since NULL = e.id
-- is never true.
SELECT e.name
FROM employees e
WHERE EXISTS (SELECT 1
              FROM bonuses b
              WHERE b.employee_id = e.id)
ORDER BY e.id;

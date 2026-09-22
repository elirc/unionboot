-- Why this works:
-- Negating a comparison never admits an unknown: NOT unknown is still
-- unknown. The only way to include the NULL rows is to name them.
-- OR a IS NULL does exactly that, so the result is Q084's three rows plus
-- ids 2 and 4.
-- IS NULL is the operator that inspects the marker; a = NULL would itself be
-- unknown and would add nothing.
SELECT id
FROM measures
WHERE a <> 5 OR a IS NULL
ORDER BY id;

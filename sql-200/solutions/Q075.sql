-- Why this works:
-- The same operator as Q074 with the branches swapped, which is the whole
-- difference: EXCEPT is directional.
-- Bo is in spring, so it is removed; NULL is in spring too and is removed by
-- the same not-distinct comparison.
-- Dee is the only autumn name with no counterpart, so one row comes back.
SELECT name FROM autumn
EXCEPT
SELECT name FROM spring
ORDER BY name;

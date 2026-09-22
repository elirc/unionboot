-- Why this works:
-- EXCEPT returns the distinct rows of the left branch that do not appear in
-- the right one, so this is "spring minus autumn".
-- Bo is removed because autumn has a Bo. NULL is removed too: autumn has
-- NULLs, and the not-distinct comparison set operators use counts them as
-- the same value.
-- Only Ada and Cy are left, each once, since EXCEPT also deduplicates.
-- The operator is not symmetric; swapping the branches gives Q075.
SELECT name FROM spring
EXCEPT
SELECT name FROM autumn
ORDER BY name;

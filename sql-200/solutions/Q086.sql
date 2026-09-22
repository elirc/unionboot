-- Why this works:
-- Ordinary equality is not null-safe: a = b is unknown whenever either side
-- is NULL, so row 4 with two NULLs would be excluded.
-- The prompt asks for an explicit emulation, so the both-NULL case is spelled
-- out as a second branch of the OR.
-- Row 5 qualifies through the first branch, 0 = 0, and row 4 through the
-- second. Rows 2 and 6 have exactly one NULL and satisfy neither.
SELECT id
FROM measures
WHERE a = b OR (a IS NULL AND b IS NULL)
ORDER BY id;

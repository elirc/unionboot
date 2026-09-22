-- Why this works:
-- NULLIF(b,0) returns NULL when b is 0 and b otherwise, so a zero
-- denominator is converted into an unknown before the division happens.
-- Any arithmetic involving NULL yields NULL, so rows 3 and 5 report null,
-- and so do the rows where a or b was already unknown.
-- Multiplying by 1.0 promotes the expression to real arithmetic, which is
-- what the prompt means by real division; with plain integers 10/2 would
-- still be 5 but a fractional result would be truncated.
SELECT id,
       1.0 * a / NULLIF(b, 0) AS ratio
FROM measures
ORDER BY id;

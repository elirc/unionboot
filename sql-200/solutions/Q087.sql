-- Why this works:
-- This is the negation of Q086, written out as the three ways two values can
-- be distinct: both known and unequal, left unknown with right known, or
-- left known with right unknown.
-- Rows 1 and 3 differ on value; rows 2 and 6 have exactly one NULL each.
-- Row 4 has two NULLs, which the prompt calls equal, and row 5 holds 0 on
-- both sides, so neither is returned.
-- Writing NOT around the Q086 predicate would not work: NOT unknown is
-- unknown, so the one-sided NULL rows would still be dropped.
SELECT id
FROM measures
WHERE a <> b
   OR (a IS NULL AND b IS NOT NULL)
   OR (a IS NOT NULL AND b IS NULL)
ORDER BY id;

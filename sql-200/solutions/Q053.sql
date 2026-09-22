-- Why this works:
-- The delta is just the current value minus the LAG of the same column, so
-- the whole computation is one subtraction around the Q051 window.
-- No special case is needed for the first row of a partition: LAG returns
-- NULL there, and arithmetic with NULL propagates NULL, which is the
-- "first delta is NULL" the prompt asks for.
-- Every consecutive pair in this seed differs by 10, so the interesting part
-- of the result is the two NULLs at the partition boundaries.
SELECT id,
       value - LAG(value) OVER (PARTITION BY sensor ORDER BY day, id) AS delta
FROM readings
ORDER BY id;

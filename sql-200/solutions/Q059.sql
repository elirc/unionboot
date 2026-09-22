-- Why this works:
-- The window has no ORDER BY, so there is no frame to move and the aggregate
-- covers the entire partition: every sensor A row divides by A's total of
-- 100, every sensor B row by B's total of 20.
-- That is the point of a share-of-total calculation, and it is also why the
-- running-total exercises need an ORDER BY and this one must not have one.
-- Writing 100.0 rather than 100 promotes the expression to real arithmetic,
-- so a quotient that is not a whole number survives instead of being floored.
SELECT id,
       ROUND(100.0 * value / SUM(value) OVER (PARTITION BY sensor), 1) AS percent
FROM readings
ORDER BY id;

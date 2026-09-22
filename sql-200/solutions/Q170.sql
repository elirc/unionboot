-- Why this works:
-- Run-length compression: keep a row only when it differs from the row
-- immediately before it, so ids 4 and 7 (repeats of 50 and 54) are dropped.
-- The first row must be kept, and its LAG is NULL, so the filter needs
-- prev IS NULL as an explicit branch: level<>NULL would be unknown and the
-- row would be lost.
-- The LAG is computed in a subquery because a window function may not be
-- used in WHERE.
SELECT id, level
FROM (SELECT id,
             level,
             LAG(level) OVER (ORDER BY id) AS prev
      FROM battery)
WHERE prev IS NULL
   OR level <> prev
ORDER BY id;

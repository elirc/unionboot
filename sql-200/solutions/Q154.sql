-- Why this works:
-- Only rows whose points are missing are touched, and IS NULL is the only
-- predicate that matches them: points=NULL is unknown and would update
-- nothing.
-- Putting the test in WHERE rather than writing
-- SET points=COALESCE(points,0) for every row means SQLite rewrites one
-- row instead of six, and the intent is visible in the statement.
-- Known values are left exactly as they were, including task 5's 1.
UPDATE tasks
   SET points = 0
 WHERE points IS NULL;
SELECT id, points
FROM tasks
ORDER BY id;

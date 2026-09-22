-- Why this works:
-- The cap lives inside the recursive half: WHERE t.depth<2 refuses to expand
-- a row that is already at depth 2, so depth 3 is never generated and Flo
-- never enters the set.
-- Capping there rather than only in the outer query is what makes the walk
-- cheap; on a large or cyclic graph it is the difference between finishing
-- and not.
-- The outer WHERE depth=2 then reports only that level, so the two rows
-- produced by the last pass are returned and Ada, Bo and Cy are not.
WITH RECURSIVE tree(id, name, depth) AS (
  SELECT id, name, 0
  FROM staff
  WHERE id = 1
  UNION ALL
  SELECT s.id, s.name, t.depth + 1
  FROM staff s
  JOIN tree t ON s.manager_id = t.id
  WHERE t.depth < 2
)
SELECT name
FROM tree
WHERE depth = 2
ORDER BY id;

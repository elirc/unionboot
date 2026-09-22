-- Why this works:
-- The anchor finds the root by structure rather than by id: manager_id IS
-- NULL is true for exactly one row, Ada, and her path starts as her own name.
-- Each recursive pass appends a slash and the child's name with ||, SQLite's
-- string concatenation operator, so the path accumulates down the tree.
-- The outer query keeps only leaves, expressed as "no staff row names this id
-- as its manager", which is a NOT EXISTS anti-join.
-- Ordering by the leaf's own staff id gives Cy, Eli, Flo.
WITH RECURSIVE tree(id, path) AS (
  SELECT id, name
  FROM staff
  WHERE manager_id IS NULL
  UNION ALL
  SELECT s.id, t.path || '/' || s.name
  FROM staff s
  JOIN tree t ON s.manager_id = t.id
)
SELECT path
FROM tree t
WHERE NOT EXISTS (SELECT 1
                  FROM staff s
                  WHERE s.manager_id = t.id)
ORDER BY t.id;

-- Why this works:
-- A recursive CTE has two halves. The anchor selects Ada and gives her depth
-- 0; the recursive half joins staff back to the rows already in tree, finding
-- everyone whose manager is in the set, and adds one to the depth.
-- SQLite repeats the second half until a pass produces no new rows, which
-- happens once Flo's level has been reached.
-- UNION ALL is safe because staff is a tree: no row can be reached twice, so
-- there are no duplicates to eliminate.
-- The column list tree(id,name,depth) names the columns once so the anchor's
-- bare literal 0 has a name the recursive half can refer to.
WITH RECURSIVE tree(id, name, depth) AS (
  SELECT id, name, 0
  FROM staff
  WHERE id = 1
  UNION ALL
  SELECT s.id, s.name, t.depth + 1
  FROM staff s
  JOIN tree t ON s.manager_id = t.id
)
SELECT name,
       depth
FROM tree
ORDER BY depth, id;

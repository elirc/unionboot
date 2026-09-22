-- Why this works:
-- The recursion builds a transitive closure: links holds one row for every
-- ancestor/descendant pair, not just the direct ones.
-- The anchor is every direct manager edge. Each pass keeps the ancestor fixed
-- and extends the descendant end by one level, so Ada eventually pairs with
-- all five people below her.
-- Self-pairs never appear because the anchor already starts one edge out,
-- which is how "excluding self" is satisfied without a filter.
-- Grouping by ancestor counts each subtree; staff who are nobody's ancestor
-- have no row in links and so are absent from the result.
WITH RECURSIVE links(ancestor, descendant) AS (
  SELECT manager_id, id
  FROM staff
  WHERE manager_id IS NOT NULL
  UNION ALL
  SELECT l.ancestor, s.id
  FROM links l
  JOIN staff s ON s.manager_id = l.descendant
)
SELECT s.name,
       COUNT(*) AS descendants
FROM links l
JOIN staff s ON s.id = l.ancestor
GROUP BY s.id, s.name
ORDER BY s.id;

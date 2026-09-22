-- Why this works:
-- This walk goes up the tree, so the recursive join is the mirror of the
-- downward one: instead of finding rows whose manager is in the set, it finds
-- the row that IS the current row's manager, s.id = c.manager_id.
-- manager_id must be carried in the CTE for that join to have something to
-- match against on the next pass.
-- Ada's manager_id is NULL, so the pass after Ada matches nothing and the
-- recursion ends, giving a chain of exactly four rows.
WITH RECURSIVE chain(id, name, manager_id, distance) AS (
  SELECT id, name, manager_id, 0
  FROM staff
  WHERE id = 6
  UNION ALL
  SELECT s.id, s.name, s.manager_id, c.distance + 1
  FROM staff s
  JOIN chain c ON s.id = c.manager_id
)
SELECT name,
       distance
FROM chain
ORDER BY distance;

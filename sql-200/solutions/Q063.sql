-- Why this works:
-- The anchor starts one level below Bo rather than at Bo: WHERE manager_id=2
-- selects Bo's direct reports, so Bo himself never enters the set and no
-- filter is needed to remove him afterwards.
-- The recursive half then extends downward in the usual way, picking up Flo
-- through Dee.
-- No depth column is carried because the prompt only asks for names.
WITH RECURSIVE tree(id, name) AS (
  SELECT id, name
  FROM staff
  WHERE manager_id = 2
  UNION ALL
  SELECT s.id, s.name
  FROM staff s
  JOIN tree t ON s.manager_id = t.id
)
SELECT name
FROM tree
ORDER BY id;

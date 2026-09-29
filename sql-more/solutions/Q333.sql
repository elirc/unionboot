-- Why this works:
-- Counting children per parent means grouping by the parent's whole key.
-- GROUP BY p.id alone would merge tenant 1's project 1 with tenant 2's
-- project 1 into a single group of two tasks.
-- The join carries both key columns for the same reason as Q331: on
-- project_id alone each project would also collect the other tenant's tasks.
-- LEFT JOIN plus COUNT(t.id) is the shape that reports a childless project
-- as 0. COUNT(*) would count the padding row the LEFT JOIN adds and report
-- 1 instead.
SELECT p.tenant,
       p.id,
       COUNT(t.id) AS tasks
FROM projects p
LEFT JOIN tasks t
  ON t.tenant = p.tenant
 AND t.project_id = p.id
GROUP BY p.tenant, p.id
ORDER BY p.tenant, p.id;

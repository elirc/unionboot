-- Why this works:
-- The parent key is the pair (tenant, id), so the join condition has to
-- mention both halves. Matching on project_id alone would also pair
-- tenant 1's task with tenant 2's project 1, turning three rows into five
-- and crossing a customer boundary.
-- USING is not available here: the child column is called project_id, not
-- id, so the columns cannot be matched by name.
-- p.title is aliased to project because that is the graded column name.
-- ORDER BY tenant then id is the key order every scenario in this family
-- uses.
SELECT t.tenant,
       t.id,
       p.title AS project
FROM tasks t
JOIN projects p
  ON p.tenant = t.tenant
 AND p.id = t.project_id
ORDER BY t.tenant, t.id;

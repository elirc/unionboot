-- Why this works:
-- This variant deletes rather than filters, so the table itself is cleaned
-- and the grader can check the stored rows.
-- The subquery lists the ids to keep - the minimum id of each normalized
-- email group - and NOT IN removes everything else.
-- NOT IN is safe here only because the kept-id list can never contain a
-- NULL: MIN(id) over a non-empty group is always a number. A NULL in that
-- list would make every comparison unknown and delete nothing.
-- The NULL email forms its own group, so row 4 is kept.
DELETE FROM raw
 WHERE id NOT IN (SELECT MIN(id) FROM raw GROUP BY lower(email));
SELECT id, email
FROM raw
ORDER BY id;

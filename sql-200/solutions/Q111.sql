-- Why this works:
-- A searched CASE evaluates its WHEN conditions top to bottom and stops at
-- the first one that is true.
-- priority=1/2/3 handle the known bands. Row 5 has priority NULL, and
-- NULL=1 is NULL, not true, so every WHEN fails and ELSE supplies
-- 'unknown'. That is why the NULL case needs no explicit test here.
-- Without the ELSE the expression would return NULL for row 5 and the
-- exact-row comparison would fail.
SELECT id,
       CASE
         WHEN priority = 1 THEN 'urgent'
         WHEN priority = 2 THEN 'normal'
         WHEN priority = 3 THEN 'low'
         ELSE 'unknown'
       END AS band
FROM tickets
ORDER BY id;

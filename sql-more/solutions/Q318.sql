-- Why this works:
-- The recipients are not in the seed, so a VALUES clause inside a CTE builds
-- the three-row list the allocation runs over.
-- 100/3 is integer division in SQLite and yields 33, not 33.333...; 100.0/3
-- would switch to floating point, and a currency amount must never take that
-- route.
-- 100%3 is the remainder, 1, so exactly one extra cent has to be handed out.
-- The CASE gives it to the recipients whose id is within that remainder,
-- which is the lowest-id-first rule the prompt states.
-- 34 + 33 + 33 = 100, so the allocation is exact by construction.
WITH recipients(id) AS (
  VALUES (1), (2), (3)
)
SELECT id,
       100 / 3 + CASE WHEN id <= 100 % 3 THEN 1 ELSE 0 END AS cents
FROM recipients
ORDER BY id;

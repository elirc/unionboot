-- Why this works:
-- Weights 1, 2 and 3 total 6, and 10 cents must be split in that proportion
-- without fractions.
-- base computes each recipient's floor share and its remainder: 10*w/6 is
-- integer division, 10*w%6 is what it threw away. That gives floors 1, 3, 5
-- and remainders 4, 2, 0.
-- r then ranks the recipients by remainder descending with id as the
-- tie-break, and uses SUM(floor_cents) OVER () -- a window with an empty
-- OVER clause, so it totals every row without collapsing any -- to learn
-- that 9 of the 10 cents are already allocated.
-- The final CASE hands the remaining 10 - 9 = 1 cent to the highest-priority
-- recipient, id 1, giving 2, 3, 5.
WITH weights(id, w) AS (
  VALUES (1, 1), (2, 2), (3, 3)
),
base AS (
  SELECT id,
         10 * w / 6 AS floor_cents,
         10 * w % 6 AS remainder
  FROM weights
),
r AS (
  SELECT *,
         ROW_NUMBER() OVER (ORDER BY remainder DESC, id) AS priority,
         SUM(floor_cents) OVER () AS allocated
  FROM base
)
SELECT id,
       floor_cents + CASE WHEN priority <= 10 - allocated THEN 1 ELSE 0 END AS cents
FROM r
ORDER BY id;

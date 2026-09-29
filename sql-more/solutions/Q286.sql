-- Why this works:
-- A gap is a relationship between neighbouring versions, so each row needs
-- to see the next one: LEAD returns a column value from the following row
-- of the same partition.
-- PARTITION BY sku keeps each SKU's timeline separate and ORDER BY
-- valid_from defines what following means.
-- The window function is computed in a CTE because a window function may
-- not appear in a WHERE clause.
-- next_start > valid_to is true only when the next version begins strictly
-- later than the previous one ended, so A's exact handover at 4 is not a
-- gap while B's 6 to 7 hole is.
-- The last version of each SKU has a NULL next_start, and NULL > valid_to is
-- unknown, so those rows drop out with no extra clause.
WITH n AS (
  SELECT sku,
         valid_to,
         LEAD(valid_from) OVER (PARTITION BY sku ORDER BY valid_from) AS next_start
  FROM prices
)
SELECT sku,
       valid_to AS gap_start,
       next_start AS gap_end
FROM n
WHERE next_start > valid_to
ORDER BY sku,
         gap_start;

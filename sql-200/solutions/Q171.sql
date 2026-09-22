-- Why this works:
-- ROW_NUMBER() OVER (PARTITION BY lower(email) ORDER BY id) numbers the
-- rows inside each group of equal normalized emails, lowest id first, so
-- n=1 is the first-seen row of each group.
-- Partitioning by an expression is allowed, and lower() is what makes
-- 'CY@x.com' and 'cy@x.com' the same group - here only ada and dee actually
-- repeat.
-- lower(NULL) is NULL, and window partitioning treats all NULLs as one
-- partition, so row 4 is alone in it and survives with n=1.
-- The filter is in the outer query because a window function may not appear
-- in WHERE.
WITH r AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY lower(email) ORDER BY id) AS n
  FROM raw
)
SELECT id, email
FROM r
WHERE n = 1
ORDER BY id;

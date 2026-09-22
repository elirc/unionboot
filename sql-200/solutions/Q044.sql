-- Why this works:
-- A window function cannot be used in WHERE, because windows are computed
-- after WHERE runs. The rank is therefore produced in a CTE, a named
-- subquery introduced by WITH, and filtered in the outer query.
-- ROW_NUMBER guarantees exactly one row per team carries rn=1, so the result
-- is one winner per team even though team B has a tied top score.
-- The id key in the window is what makes that choice deterministic: Eli (id
-- 5) beats Flo (id 6), which is the prompt's "lower id on ties".
WITH ranked AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY team ORDER BY score DESC, id) AS rn
  FROM scores
)
SELECT team,
       name,
       score
FROM ranked
WHERE rn = 1
ORDER BY team;

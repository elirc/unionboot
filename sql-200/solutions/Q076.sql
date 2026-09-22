-- Why this works:
-- The symmetric difference is "in spring but not autumn" plus "in autumn but
-- not spring", which is two EXCEPT sets combined with UNION.
-- Each half is named in a CTE first. SQLite gives the set operators equal
-- precedence and evaluates them strictly left to right, so writing them in
-- one flat chain would not group the way the intent requires; the CTEs make
-- the grouping explicit.
-- NULL appears in both cohorts, so both EXCEPT halves remove it and it is
-- absent from the answer.
WITH a AS (
  SELECT name FROM spring
  EXCEPT
  SELECT name FROM autumn
),
b AS (
  SELECT name FROM autumn
  EXCEPT
  SELECT name FROM spring
)
SELECT name FROM a
UNION
SELECT name FROM b
ORDER BY name;

-- Why this works:
-- The two SQLite JSON operators differ in what they hand back.
-- body->'$.name' renders the value as JSON text, so the string keeps its
-- quote characters and the result is the five-character "Ada".
-- body->>'$.name' unwraps it to a SQL value, the three-character Ada, which
-- is the same thing single-path json_extract returns.
-- WHERE id=1 selects the single graded row, so no ORDER BY is needed.
SELECT body->'$.name' AS json_name,
       body->>'$.name' AS sql_name
FROM docs
WHERE id = 1;

-- Why this works:
-- INTERSECT would include the shared NULL, as Q073 shows, so the exclusion
-- has to be stated as an ordinary filter on each branch before the operator
-- ever sees the rows.
-- There is no NULL-excluding variant of the operator; WHERE name IS NOT NULL
-- is the whole mechanism.
-- Bo is then the only value present on both sides.
SELECT name FROM spring WHERE name IS NOT NULL
INTERSECT
SELECT name FROM autumn WHERE name IS NOT NULL
ORDER BY name;

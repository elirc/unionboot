-- Why this works:
-- A literal column tags each branch with where its rows came from, which is
-- what keeps two structurally identical SELECTs distinguishable.
-- DISTINCT is applied inside each branch, so spring's two Bo rows become one
-- spring/Bo pair; UNION ALL then keeps that pair alongside autumn's Bo pair
-- instead of merging them.
-- Using UNION for the whole compound would deduplicate across branches as
-- well, which is not what "deduplicate inside each cohort" asks for.
-- The NULL rows are filtered out of both branches before tagging.
SELECT DISTINCT name, 'spring' AS source FROM spring WHERE name IS NOT NULL
UNION ALL
SELECT DISTINCT name, 'autumn' AS source FROM autumn WHERE name IS NOT NULL
ORDER BY name, source;

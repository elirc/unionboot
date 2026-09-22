-- Why this works:
-- A join is not a set operator. INTERSECT asks whether a value is in both
-- sets and answers once; a join enumerates matching pairs, so spring's two Bo
-- rows each pair with autumn's single Bo and two identical rows come back.
-- That fan-out is the point of this scenario rather than a defect.
-- The join condition uses ordinary equality, and NULL = NULL is unknown, so
-- the NULL rows match nothing and no explicit filter is needed to exclude
-- them.
SELECT s.name
FROM spring s
JOIN autumn a ON s.name = a.name
ORDER BY s.name;

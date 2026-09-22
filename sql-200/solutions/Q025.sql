-- Why this works:
-- AVG ignores NULL inputs in both the numerator and the denominator, so West
-- averages its one known amount and reports 5 rather than 2.5.
-- South has no known amount at all, so AVG has nothing to divide and returns
-- NULL, which the expected row keeps as null.
-- East is 130/3 = 43.333..., and ROUND(...,2) trims it to 43.33; ROUND
-- returns a real, so an exact value like 15.0 arrives as the number 15.
SELECT region,
       ROUND(AVG(amount), 2) AS average
FROM sales
GROUP BY region
ORDER BY region;

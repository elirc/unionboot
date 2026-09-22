-- Why this works:
-- COALESCE runs per row, before the aggregate, so an unknown amount becomes a
-- real 0 that AVG must both add and count.
-- That changes the denominator, not just the sum: West averages 5 and 0 to
-- 2.5, where Q025 ignored the NULL and reported 5.
-- South now has one value, 0, so its average is 0 instead of NULL.
-- East and North contain no NULLs, so they are unchanged from Q025.
SELECT region,
       ROUND(AVG(COALESCE(amount, 0)), 2) AS average
FROM sales
GROUP BY region
ORDER BY region;

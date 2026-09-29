-- Why this works:
-- The two requested numbers are different questions over the same exploded
-- rows, so both aggregates sit in one GROUP BY.
-- COUNT(*) counts occurrences: every element row is one occurrence, so
-- basket 1's repeated red contributes twice.
-- COUNT(DISTINCT b.id) counts documents instead, collapsing that repetition,
-- which is why red reports 2 occurrences but only 1 basket.
-- blue occurs once in each of two baskets and so reports 2 and 2.
SELECT j.value AS tag,
       COUNT(*) AS occurrences,
       COUNT(DISTINCT b.id) AS baskets
FROM baskets b,
     json_each(b.body, '$.tags') j
GROUP BY j.value
ORDER BY tag;

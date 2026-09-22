-- Why this works:
-- COUNT(*) over the whole table is 7 rows.
-- The subquery groups by normalized email and counts the groups: ada, bo,
-- cy, dee and one NULL group, so 5. NULLs collapse into a single group
-- under GROUP BY, which is why the missing email counts as one distinct
-- value rather than being skipped.
-- 7 - 5 = 2 is the number of rows that would disappear if each email were
-- reduced to one row, and both aggregates are computed in the same
-- single-row SELECT, so the result is one summary row.
SELECT COUNT(*) - (SELECT COUNT(*)
                     FROM (SELECT lower(email) FROM raw GROUP BY lower(email))) AS duplicate_count,
       COUNT(*) AS total_rows
FROM raw;

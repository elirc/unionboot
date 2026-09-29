-- Why this works:
-- The report is per user, so the grouping column is u.id rather than the
-- cohort.
-- The LEFT JOIN keeps user 4, whose a.day is NULL. COUNT of a column skips
-- NULLs, so that group counts 0 -- a real zero, which is what the prompt
-- asks for. COUNT(*) would return 1 there, counting the padding row.
-- DISTINCT collapses user 1's duplicated day-1 rows, so days 0, 1, 1, 3
-- count as three distinct days.
SELECT u.id,
       COUNT(DISTINCT a.day) AS active_days
FROM users u
LEFT JOIN activity a ON a.user_id = u.id
GROUP BY u.id
ORDER BY u.id;

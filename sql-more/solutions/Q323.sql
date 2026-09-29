-- Why this works:
-- Same scaffold as Q322; only the retention condition changes.
-- Rolling retention asks whether the user was seen on any day at or after
-- join+1, so the equality becomes a range: a.day >= u.joined + 1.
-- The upper bound a.day <= 3 is the as-of day the prompt fixes. Without it
-- the query would silently include activity from a future the report does
-- not yet cover.
-- The LEFT JOIN still matters: user 4 contributes a NULL day, the CASE
-- yields NULL, and COUNT skips it, so cohort 1 reports 1 rather than
-- disappearing.
SELECT u.joined AS cohort,
       COUNT(DISTINCT CASE WHEN a.day >= u.joined + 1 AND a.day <= 3 THEN u.id END) AS retained
FROM users u
LEFT JOIN activity a ON a.user_id = u.id
GROUP BY u.joined
ORDER BY cohort;

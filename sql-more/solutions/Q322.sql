-- Why this works:
-- The denominator is signups, so the query is driven from users and the
-- join to activity is a LEFT JOIN: user 4 has no activity rows and must
-- still be counted in its cohort.
-- Retention is a conditional distinct count. The CASE has no ELSE, so a row
-- that fails the test yields NULL, and COUNT ignores NULLs.
-- COUNT(DISTINCT ...) of u.id, not of the rows, is what makes the duplicate
-- activity row for user 1 on day 1 count once instead of twice.
-- COUNT(DISTINCT u.id) is likewise the signup denominator; COUNT(*) would
-- count joined rows, which is 5 for cohort 0.
-- The condition a.day = u.joined + 1 is the exact-day-one definition; Q323
-- and Q324 change only that expression.
SELECT u.joined AS cohort,
       COUNT(DISTINCT CASE WHEN a.day = u.joined + 1 THEN u.id END) AS retained,
       COUNT(DISTINCT u.id) AS signups
FROM users u
LEFT JOIN activity a ON a.user_id = u.id
GROUP BY u.joined
ORDER BY cohort;

-- Why this works:
-- Two separate rules, in two separate places.
-- The maturity rule decides which cohorts may be reported at all, so it is a
-- row filter on users: u.joined + 3 <= 3 admits only cohort 0, because
-- cohort 1 has not yet lived three days as of day 3.
-- The retention rule decides who inside a reported cohort counts, so it is
-- the CASE condition: activity on exactly join+3.
-- Putting the maturity rule in the CASE instead would still emit a row for
-- cohort 1, with retained 0, which misreports an unknown as a zero. The
-- expected result is a single row.
SELECT u.joined AS cohort,
       COUNT(DISTINCT CASE WHEN a.day = u.joined + 3 THEN u.id END) AS retained,
       COUNT(DISTINCT u.id) AS signups
FROM users u
LEFT JOIN activity a ON a.user_id = u.id
WHERE u.joined + 3 <= 3
GROUP BY u.joined
ORDER BY cohort;

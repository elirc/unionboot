-- Why this works:
-- age is how old the account was on the day it was active: a.day minus
-- u.joined. Grouping by cohort and age gives one cell of the retention
-- matrix per group.
-- This is the one scenario in the family that wants an inner join. Only
-- observed pairs are reported, and user 4 has no activity, so it has no age
-- and contributes no cell; a LEFT JOIN would add a row with a NULL age.
-- COUNT(DISTINCT u.id) counts people, not events, so user 1's duplicated
-- day-1 activity does not inflate the (0,1) cell.
-- SQLite allows GROUP BY and ORDER BY to name output aliases, so cohort and
-- age can be reused here instead of repeating the expressions.
SELECT u.joined AS cohort,
       a.day - u.joined AS age,
       COUNT(DISTINCT u.id) AS active
FROM users u
JOIN activity a ON a.user_id = u.id
GROUP BY cohort, age
ORDER BY cohort, age;

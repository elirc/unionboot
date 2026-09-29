-- Why this works:
-- Activation is a per-user yes or no, so the CTE reduces each user to one
-- row carrying the cohort and a flag.
-- EXISTS is an expression in SQLite, not only a predicate: it evaluates to
-- the integer 1 or 0. That is what makes the flag summable.
-- The window is join to join+1 inclusive, so user 1 (day 0) and user 2
-- (day 0) activate, user 3 (day 1, joined 1) activates, and user 4 does not.
-- SUM(activated) and SUM(1-activated) then split each cohort without running
-- the subquery twice, so the two columns cannot disagree.
-- Grouping by joined keeps both cohorts, including the one whose
-- not_activated total is 0.
WITH flags AS (
  SELECT joined,
         EXISTS (
           SELECT 1
           FROM activity a
           WHERE a.user_id = u.id
             AND a.day BETWEEN u.joined AND u.joined + 1
         ) AS activated
  FROM users u
)
SELECT joined AS cohort,
       SUM(activated) AS activated,
       SUM(1 - activated) AS not_activated
FROM flags
GROUP BY joined
ORDER BY joined;

-- Why this works:
-- Churn as of day 3 is defined as silence over days 2 and 3, so the only
-- change from Q326 is the day window inside the subquery.
-- BETWEEN in SQLite is inclusive at both ends, so days 2 and 3 are both part
-- of the window; user 1's activity on day 3 is what keeps them off the list.
-- Expressing the test as NOT EXISTS rather than as has-activity-elsewhere
-- picks up never-activated users for free: user 4 has no rows in the window
-- because it has no rows at all.
-- User 2 was last seen on day 0, so it is silent in the window and churned.
SELECT u.id
FROM users u
WHERE NOT EXISTS (
  SELECT 1
  FROM activity a
  WHERE a.user_id = u.id
    AND a.day BETWEEN 2 AND 3
)
ORDER BY u.id;

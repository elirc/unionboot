-- Why this works:
-- The cohort denominator is a property of signups alone, so activity is not
-- joined at all. Bringing it in would drop user 4, who never acted.
-- GROUP BY joined forms one group per signup day, and COUNT(*) counts the
-- rows in each group -- here one row per user, because id is the primary
-- key of users.
-- joined is aliased to cohort because that is the graded column name; the
-- ORDER BY may use either the column or the alias.
SELECT joined AS cohort,
       COUNT(*) AS users
FROM users
GROUP BY joined
ORDER BY joined;

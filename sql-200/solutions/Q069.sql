-- Why this works:
-- Grouping the events table alone could never produce 2024-01-02, because no
-- event happened that day. So the recursion generates a date spine first:
-- one row per calendar day, using SQLite's date(day,'+1 day') modifier.
-- Dates are stored as ISO text, so the guard day<'2024-01-04' is an ordinary
-- string comparison that happens to sort chronologically.
-- LEFT JOIN attaches events to the spine while keeping every day, and
-- COUNT(e.id) reports 0 for the padded day where COUNT(*) would report 1.
WITH RECURSIVE days(day) AS (
  VALUES('2024-01-01')
  UNION ALL
  SELECT date(day, '+1 day')
  FROM days
  WHERE day < '2024-01-04'
)
SELECT d.day,
       COUNT(e.id) AS events
FROM days d
LEFT JOIN events e ON e.day = d.day
GROUP BY d.day
ORDER BY d.day;

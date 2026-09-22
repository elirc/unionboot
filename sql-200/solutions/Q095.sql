-- Why this works:
-- The modifier is applied inside the same date() call, so the shift happens
-- to the full timestamp and the day is computed afterwards.
-- That is what rolls id 1 from 23:30 on 28 February onto the 29th, and id 5
-- from 23:00 on 31 December into 2025-01-01.
-- '+2 hours' is fixed arithmetic, not a time zone: SQLite has no IANA
-- database and applies no daylight-saving rule, which the prompt states.
-- Truncating first and shifting afterwards would move a midnight instead of
-- the real time and give different days.
SELECT id,
       date(happened_at, '+2 hours') AS local_day
FROM events
ORDER BY id;

-- Why this works:
-- date() parses the stored text as a date-time and formats only the date
-- part, so the time is dropped rather than rounded: id 1 at 23:30 stays on
-- 2024-02-28 and id 5 at 23:00 stays on 2024-12-31.
-- No modifier is supplied, so no shifting happens; Q095 is the variant that
-- adds one.
-- The result is TEXT. SQLite has no date storage type, so the graded values
-- are strings such as '2024-02-28'.
SELECT id,
       date(happened_at) AS day
FROM events
ORDER BY id;

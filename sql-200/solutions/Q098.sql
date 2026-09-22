-- Why this works:
-- %w numbers Sunday 0 through Saturday 6, so subtracting it directly would
-- land on Sunday. (w + 6) % 7 rotates the week to a Monday base: Monday 1
-- becomes 0, Tuesday 2 becomes 1, and Sunday 0 becomes 6.
-- That rotated number is exactly how many days to step back, which is why a
-- Sunday belongs to the Monday six days earlier rather than the next one.
-- CAST is required because strftime returns text; without it the arithmetic
-- would operate on a string.
-- The offset is concatenated into a modifier string such as '-2 days' and
-- handed to date(), which does the calendar step.
SELECT id,
       date(happened_at,
            '-' || ((CAST(strftime('%w', happened_at) AS INTEGER) + 6) % 7) || ' days') AS week_start
FROM events
ORDER BY id;

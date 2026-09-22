-- Why this works:
-- Modifiers are applied left to right. 'start of month' snaps to midnight on
-- the first, '+1 month' moves to the first of the next month, and '-1 day'
-- steps back onto the last day of the original month.
-- The leap year falls out of the arithmetic: February 2024 ends on the 29th
-- and nothing in the query mentions February or 29.
-- Hard-coding a month length, or adding 28 days, would be wrong for four
-- months of the year and for every leap February.
SELECT id,
       date(happened_at, 'start of month', '+1 month', '-1 day') AS month_end
FROM events
ORDER BY id;

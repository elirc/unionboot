-- Why this works:
-- This is the gaps-and-islands trick. ROW_NUMBER() numbers the visits
-- 1,2,3,... in day order, and within a run of consecutive days both day and
-- the row number increase by exactly one.
-- Their difference is therefore constant inside a run and jumps whenever a
-- day is missing, which makes it a group key for the run.
-- The key's value carries no meaning of its own: days 1,2 give 0, days
-- 4,5,6 give 1, day 9 gives 3. Only equality matters.
SELECT day,
       day - ROW_NUMBER() OVER (ORDER BY day) AS island
FROM visits
ORDER BY day;

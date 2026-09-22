-- Why this works:
-- The CASE has no ELSE, so non-open rows evaluate to NULL.
-- AVG ignores NULL inputs entirely: it divides by the number of non-NULL
-- values, not by the number of rows in the group. Adding ELSE 0 would drag
-- closed and pending rows into the divisor and change both answers.
-- Team A averages ticket 1's 2 hours (ticket 3 is open but NULL, so it is
-- skipped too). Team B averages ticket 6's 0 hours, giving 0 - a real zero,
-- not a missing value.
SELECT team,
       AVG(CASE WHEN status = 'open' THEN hours END) AS average_open
FROM tickets
GROUP BY team
ORDER BY team;

-- Why this works:
-- The same "first per group" answer as Q171, reached with grouping instead
-- of a window: GROUP BY collapses each normalized email to one row and
-- MIN(id) picks its lowest id.
-- The difference from Q171 is what you can report. Here only the group key
-- and aggregates are available, so the output is the normalized email, not
-- the stored spelling: 'cy@x.com', where Q171 returned 'CY@x.com'.
-- GROUP BY puts all NULL emails in a single group, unlike = comparisons,
-- so the NULL row appears once with first_id 4 and sorts first.
SELECT lower(email) AS email,
       MIN(id) AS first_id
FROM raw
GROUP BY lower(email)
ORDER BY email;

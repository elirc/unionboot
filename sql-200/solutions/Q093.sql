-- Why this works:
-- strftime formats a timestamp with the placeholders in its first argument,
-- so '%Y-%m' collapses every event to its year and month as text.
-- Grouping by that derived string buckets the five events into three months.
-- SQLite allows GROUP BY to reference a select-list alias, so the expression
-- is written once rather than repeated.
-- The month values are strings, and ordering them lexically also orders them
-- chronologically because the format is zero-padded and year-first.
SELECT strftime('%Y-%m', happened_at) AS month,
       COUNT(*) AS events
FROM events
GROUP BY month
ORDER BY month;

-- Why this works:
-- Conditional aggregation pivots rows into columns: one SUM per target
-- status, each summing 1 for a matching row and 0 otherwise.
-- SUM over an all-zero group returns 0, which is what fills team A's
-- pending_count; COUNT(CASE ...) with no ELSE would also give 0, but
-- SUM(CASE ... ELSE 0 END) makes the zero-fill explicit.
-- GROUP BY team produces one row per team, and every status column is
-- computed from the same group, so a single scan builds the whole pivot.
SELECT team,
       SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) AS open_count,
       SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed_count,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_count
FROM tickets
GROUP BY team
ORDER BY team;

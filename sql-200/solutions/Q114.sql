-- Why this works:
-- Same pivot shape as Q113, but the per-row contribution is hours instead
-- of 1.
-- Ticket 3 is open with NULL hours. SUM ignores NULL inputs, so plain
-- SUM(CASE WHEN status='open' THEN hours ELSE 0 END) would also give 2 for
-- team A; COALESCE(hours,0) states the zero-fill rule in the query instead
-- of relying on the aggregate to skip it.
-- Team B has no open hours other than ticket 6's 0, so open_hours is 0 and
-- not NULL, because the ELSE 0 branch always contributes a number.
SELECT team,
       SUM(CASE WHEN status = 'open' THEN COALESCE(hours, 0) ELSE 0 END) AS open_hours,
       SUM(CASE WHEN status = 'closed' THEN COALESCE(hours, 0) ELSE 0 END) AS closed_hours
FROM tickets
GROUP BY team
ORDER BY team;

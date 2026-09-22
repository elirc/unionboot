-- Why this works:
-- RANGE measures the ordering column's value rather than counting rows, so
-- every row whose day is less than or equal to the current day is in the
-- frame. The two sensor A readings on day 2 are peers and both report 60.
-- The window orders by day alone on purpose. Adding id would make each
-- ordering key unique, the peers would stop being peers, and RANGE would
-- behave exactly like the ROWS frame of Q054.
-- The statement still returns rows in id order; that is a separate clause.
SELECT id,
       SUM(value) OVER (PARTITION BY sensor ORDER BY day
                        RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total
FROM readings
ORDER BY id;

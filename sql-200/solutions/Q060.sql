-- Why this works:
-- RANGE BETWEEN 1 PRECEDING AND CURRENT ROW is measured in days, not rows,
-- because day is the window's ordering column and it holds plain integers.
-- Id 4 sits on day 4 and sensor A has no day-3 reading, so its frame contains
-- only itself and the total is 40. A ROWS frame would have reached back to id
-- 3 and returned 70, which is the distinction the prompt highlights.
-- The two day-2 rows are peers, so both cover days 1 and 2 and both report
-- 60; ordering the window by day alone is what keeps them peers.
SELECT id,
       SUM(value) OVER (PARTITION BY sensor ORDER BY day
                        RANGE BETWEEN 1 PRECEDING AND CURRENT ROW) AS total
FROM readings
ORDER BY id;

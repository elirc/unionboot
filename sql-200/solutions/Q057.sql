-- Why this works:
-- Moving the frame end from CURRENT ROW to 1 FOLLOWING centres the window on
-- the current row, so each average covers up to three readings.
-- Frames are clipped at the partition edges rather than erroring: the first
-- and last rows of each partition average two values, and sensor B, which has
-- only two rows, averages the same pair twice.
-- The window still orders by day,id so the day-2 pair has a fixed sequence.
SELECT id,
       ROUND(AVG(value) OVER (PARTITION BY sensor ORDER BY day, id
                              ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING), 2) AS average
FROM readings
ORDER BY id;

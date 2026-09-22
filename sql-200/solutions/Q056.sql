-- Why this works:
-- ROWS BETWEEN 1 PRECEDING AND CURRENT ROW is a two-row sliding window, so
-- this is a moving average of the latest pair of readings.
-- At the first row of a partition the frame simply contains one row, and AVG
-- divides by 1: ids 1 and 5 report their own values rather than NULL.
-- ROWS, not RANGE, is correct here because the prompt counts readings rather
-- than days, so the two day-2 rows are treated as separate steps.
SELECT id,
       ROUND(AVG(value) OVER (PARTITION BY sensor ORDER BY day, id
                              ROWS BETWEEN 1 PRECEDING AND CURRENT ROW), 2) AS average
FROM readings
ORDER BY id;

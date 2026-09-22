-- Why this works:
-- LAG reads the value of the row one position earlier inside the partition,
-- in the window's ORDER BY order.
-- PARTITION BY sensor stops sensor B's first reading from borrowing sensor
-- A's last one, which is why two rows come back with previous NULL.
-- ORDER BY day,id inside the window settles the two A readings that share day
-- 2; without the id key their relative order, and so their LAG values, would
-- be arbitrary.
-- No default argument is given, so the first row of each partition gets NULL,
-- exactly as the prompt requires.
SELECT id,
       LAG(value) OVER (PARTITION BY sensor ORDER BY day, id) AS previous
FROM readings
ORDER BY id;

-- Why this works:
-- The frame has to be stated explicitly. When a window has an ORDER BY and no
-- frame clause, the default frame ends at the current row, so LAST_VALUE
-- would return each row's own value instead of the partition's final one.
-- ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING widens the frame
-- to the whole partition, making the frame's last row the partition's last
-- row: 40 everywhere in sensor A, 15 everywhere in sensor B.
-- FIRST_VALUE does not need this treatment, which is why the asymmetry is
-- worth remembering.
SELECT id,
       LAST_VALUE(value) OVER (PARTITION BY sensor ORDER BY day, id
                               ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_value
FROM readings
ORDER BY id;

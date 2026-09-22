-- Why this works:
-- LEAD is LAG in the other direction: it reads the row one position later in
-- the partition.
-- The three arguments are value, offset and default. Supplying 0 as the
-- default is what turns the missing row at the end of each partition into a
-- zero rather than a NULL.
-- Both partitions therefore end in 0: id 4 for sensor A and id 6 for B.
SELECT id,
       LEAD(value, 1, 0) OVER (PARTITION BY sensor ORDER BY day, id) AS next
FROM readings
ORDER BY id;

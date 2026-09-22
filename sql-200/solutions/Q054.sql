-- Why this works:
-- An aggregate with OVER computes over a frame, a moving slice of the
-- partition. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW means "every
-- row from the start of the partition up to and including this one", which
-- is the definition of a running total.
-- ROWS counts physical rows, so the two sensor A readings on day 2 get
-- different totals, 30 and 60: id 2 has not yet seen id 3.
-- The id tiebreak in the window's ORDER BY is what makes that sequence
-- deterministic.
SELECT id,
       SUM(value) OVER (PARTITION BY sensor ORDER BY day, id
                        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS total
FROM readings
ORDER BY id;

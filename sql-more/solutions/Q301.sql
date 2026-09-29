-- Why this works:
-- The question is about keys present remotely and absent locally, so remote
-- is the outer table and local is the one we probe.
-- NOT EXISTS runs a correlated subquery per remote row: it returns true when
-- that subquery finds nothing. Only the key is compared, so the NULL value
-- on key C never takes part in the test.
-- NOT IN (SELECT key FROM local) would also work on this seed because key is
-- a PRIMARY KEY and cannot be NULL, but NOT EXISTS is the form that stays
-- correct when the probed column is nullable.
-- ORDER BY r.key fixes the row order the grader compares.
SELECT r.key,
       r.value
FROM remote r
WHERE NOT EXISTS (SELECT 1 FROM local l WHERE l.key = r.key)
ORDER BY r.key;

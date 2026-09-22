-- Why this works:
-- The same transfer as Q141, ended with ROLLBACK instead of COMMIT.
-- ROLLBACK undoes every change made since BEGIN, so both UPDATEs are
-- discarded and the balances return to their seeded 100 and 50.
-- The updates really did run: they were visible to statements inside the
-- transaction. Rollback is about what is kept, not about what executed.
BEGIN;
UPDATE accounts SET balance = balance - 20 WHERE id = 1;
UPDATE accounts SET balance = balance + 20 WHERE id = 2;
ROLLBACK;
SELECT id, balance
FROM accounts
ORDER BY id;

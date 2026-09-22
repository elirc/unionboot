-- Why this works:
-- RELEASE is not a commit. Releasing a savepoint inside an open
-- transaction only merges its work into the enclosing transaction; nothing
-- is durable until that outer transaction commits.
-- Here the outer transaction ends in ROLLBACK, so the +30 that was released
-- a moment earlier is discarded with everything else.
-- Both balances therefore stay at their seeded values.
BEGIN;
SAVEPOINT inner_step;
UPDATE accounts SET balance = balance + 30 WHERE id = 2;
RELEASE inner_step;
ROLLBACK;
SELECT id, balance
FROM accounts
ORDER BY id;

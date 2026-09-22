-- Why this works:
-- BEGIN IMMEDIATE takes the database's write lock at once instead of
-- waiting for the first write, which is how you avoid a later upgrade
-- failing under concurrent writers.
-- This pack runs one connection against a fresh :memory: database, so the
-- locking has nothing to contend with; what is graded is the committed
-- state, exactly as in Q141.
-- The transfer is balanced, so the total stays at 150.
BEGIN IMMEDIATE;
UPDATE accounts SET balance = balance - 15 WHERE id = 1;
UPDATE accounts SET balance = balance + 15 WHERE id = 2;
COMMIT;
SELECT id, balance
FROM accounts
ORDER BY id;

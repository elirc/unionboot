-- Why this works:
-- SAVEPOINT issued while no transaction is open starts one itself, so this
-- savepoint is the outermost transaction.
-- RELEASE of the outermost savepoint is therefore a real commit, which is
-- the case Q144 contrasts with: there the savepoint was nested inside an
-- explicit BEGIN and releasing it committed nothing.
-- The UPDATE has no WHERE clause, so both rows gain 5.
SAVEPOINT batch;
UPDATE accounts SET balance = balance + 5;
RELEASE batch;
SELECT id, balance
FROM accounts
ORDER BY id;

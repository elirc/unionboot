-- Why this works:
-- A SAVEPOINT is a named marker inside a transaction that you can rewind to
-- without abandoning the whole transaction.
-- The first UPDATE happens before the savepoint, so it survives. The +99 to
-- account 2 happens after it and is undone by ROLLBACK TO optional.
-- ROLLBACK TO rewinds but keeps the savepoint alive, so RELEASE optional is
-- still needed to discard the marker.
-- COMMIT then keeps only the pre-savepoint work: account 1 at 90.
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
SAVEPOINT optional;
UPDATE accounts SET balance = balance + 99 WHERE id = 2;
ROLLBACK TO optional;
RELEASE optional;
COMMIT;
SELECT id, balance
FROM accounts
ORDER BY id;

-- Why this works:
-- Savepoints nest, and ROLLBACK TO names which level to rewind to. The
-- three increments are +1 before savepoint a, +2 between a and b, and +4
-- after b.
-- ROLLBACK TO b discards only the work done after b, so +4 is lost and +1
-- and +2 survive: 100 + 1 + 2 = 103.
-- RELEASE b then RELEASE a discard the markers, merging their work into the
-- outer transaction, and COMMIT makes it permanent.
BEGIN;
UPDATE accounts SET balance = balance + 1 WHERE id = 1;
SAVEPOINT a;
UPDATE accounts SET balance = balance + 2 WHERE id = 1;
SAVEPOINT b;
UPDATE accounts SET balance = balance + 4 WHERE id = 1;
ROLLBACK TO b;
RELEASE b;
RELEASE a;
COMMIT;
SELECT id, balance
FROM accounts
ORDER BY id;

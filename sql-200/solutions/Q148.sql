-- Why this works:
-- Same unit of work as Q147, rolled back instead of committed. Atomicity
-- cuts both ways: the audit row disappears along with the transfer, so
-- audit_count is 0 and the balances are the seeded 100 and 50.
-- The rollback also gives back the rowid the INSERT had consumed, but
-- nothing here observes that.
-- The scalar subquery is evaluated after the rollback, so it counts the
-- restored, empty audit table.
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
INSERT INTO audit(note) VALUES('transfer:10');
ROLLBACK;
SELECT id,
       balance,
       (SELECT COUNT(*) FROM audit) AS audit_count
FROM accounts
ORDER BY id;

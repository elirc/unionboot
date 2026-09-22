-- Why this works:
-- BEGIN opens an explicit transaction, so the two UPDATEs are one unit of
-- work; COMMIT makes both permanent at the same instant.
-- The two amounts match, which is what keeps the total at 150 and keeps the
-- CHECK(balance>=0) constraint satisfied at every step.
-- Without BEGIN each statement would autocommit on its own, and a failure
-- between them would leave money missing.
-- The trailing SELECT runs outside the transaction and reports the
-- committed state.
BEGIN;
UPDATE accounts SET balance = balance - 20 WHERE id = 1;
UPDATE accounts SET balance = balance + 20 WHERE id = 2;
COMMIT;
SELECT id, balance
FROM accounts
ORDER BY id;

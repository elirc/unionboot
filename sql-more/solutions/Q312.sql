-- Why this works:
-- This is the complement of Q311, written with the signed formulation.
-- SUM(debit-credit) is the net imbalance of a transaction: zero when it
-- balances, positive when debits exceed credits.
-- HAVING keeps only the groups whose net is nonzero, so transactions 1 and 2
-- drop out and transaction 3 remains with a discrepancy of 5.
-- The same expression appears twice, in the SELECT list and in HAVING; SQLite
-- computes the aggregate once per group either way.
SELECT tx,
       SUM(debit - credit) AS discrepancy
FROM ledger
GROUP BY tx
HAVING SUM(debit - credit) <> 0
ORDER BY tx;

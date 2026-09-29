-- Why this works:
-- A reversal in bookkeeping is not an edit, it is a new transaction whose
-- lines cancel the original. History stays intact and the cancellation is
-- visible.
-- INSERT ... SELECT copies transaction 2's two lines under tx 4 with the
-- debit and credit columns exchanged in the projection, so every
-- debit - credit term flips sign and the pair nets to zero.
-- line is copied unchanged, so the new rows are (4,1) and (4,2) and the
-- composite primary key on (tx,line) is satisfied.
-- expense therefore settles at 0 while cash rises to 120. Transaction 3 is
-- untouched, so income stays at -115.
INSERT INTO ledger
SELECT 4,
       line,
       account,
       credit,
       debit
FROM ledger
WHERE tx = 2;
SELECT account,
       SUM(debit - credit) AS balance
FROM ledger
GROUP BY account
ORDER BY account;

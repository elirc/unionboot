-- Why this works:
-- The balance rule applies per transaction, so GROUP BY tx forms one group
-- per transaction and the two aggregates run inside each group.
-- The test belongs in HAVING, not WHERE: WHERE filters individual lines
-- before any grouping happens and cannot see a SUM.
-- Transaction 3 has debits 20 and credits 15, so its group is dropped and
-- only transactions 1 and 2 remain.
-- For a balanced transaction the debit total equals the credit total, so
-- SUM(debit) is the amount the prompt asks for.
SELECT tx,
       SUM(debit) AS amount
FROM ledger
GROUP BY tx
HAVING SUM(debit) = SUM(credit)
ORDER BY tx;

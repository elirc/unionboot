-- Why this works:
-- Quarantine applies to whole transactions, not to individual lines, so the
-- CTE first collects the tx values that balance -- exactly Q311's query,
-- projecting only the key.
-- The main query then restricts the ledger to those transactions before
-- grouping by account, which removes both lines of transaction 3 together.
-- Filtering lines instead would keep the cash line of transaction 3 and
-- leave cash at 90 instead of 70.
-- Balances then come out as 100 - 30 for cash, 30 for expense and -100 for
-- income.
WITH good AS (
  SELECT tx
  FROM ledger
  GROUP BY tx
  HAVING SUM(debit) = SUM(credit)
)
SELECT account,
       SUM(debit - credit) AS balance
FROM ledger
WHERE tx IN (SELECT tx FROM good)
GROUP BY account
ORDER BY account;

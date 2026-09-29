-- Why this works:
-- Cash flow is about one account, so the restriction is on lines and belongs
-- in WHERE, before grouping.
-- Every transaction in this seed has a cash line, so all three groups
-- survive. Transaction 2's cash line is a credit, which is why its inflow is
-- the integer 0 rather than a missing row.
-- Inflow is money arriving in the cash account, which under double entry is
-- a debit to cash; outflow is a credit. net is the signed difference and
-- agrees with inflow - outflow line by line.
SELECT tx,
       SUM(debit) AS inflow,
       SUM(credit) AS outflow,
       SUM(debit - credit) AS net
FROM ledger
WHERE account = 'cash'
GROUP BY tx
ORDER BY tx;

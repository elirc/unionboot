SELECT tx,SUM(debit) AS inflow,SUM(credit) AS outflow,SUM(debit-credit) AS net FROM ledger WHERE account='cash' GROUP BY tx ORDER BY tx;

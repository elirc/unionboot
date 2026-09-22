SELECT account,SUM(debit-credit) AS balance FROM ledger GROUP BY account ORDER BY account;

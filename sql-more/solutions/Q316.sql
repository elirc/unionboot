INSERT INTO ledger SELECT 4,line,account,credit,debit FROM ledger WHERE tx=2;SELECT account,SUM(debit-credit) AS balance FROM ledger GROUP BY account ORDER BY account;

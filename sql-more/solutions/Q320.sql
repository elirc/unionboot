INSERT INTO ledger VALUES(3,3,'suspense',0,5);SELECT tx,SUM(debit-credit) AS discrepancy FROM ledger GROUP BY tx ORDER BY tx;

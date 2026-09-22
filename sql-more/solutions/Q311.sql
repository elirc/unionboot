SELECT tx,SUM(debit) AS amount FROM ledger GROUP BY tx HAVING SUM(debit)=SUM(credit) ORDER BY tx;

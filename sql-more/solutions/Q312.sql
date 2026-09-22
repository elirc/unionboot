SELECT tx,SUM(debit-credit) AS discrepancy FROM ledger GROUP BY tx HAVING SUM(debit-credit)<>0 ORDER BY tx;

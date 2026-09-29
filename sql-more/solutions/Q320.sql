-- Why this works:
-- Transaction 3 carries 5 more debit than credit, so the repair is a credit
-- line of 5. A debit of 5 would double the gap instead of closing it.
-- suspense is the conventional holding account for an amount that is known
-- to be missing but not yet explained; parking it there keeps the ledger
-- balanced without inventing activity on a real account.
-- The new row is (3,3): transaction 3 already owns lines 1 and 2, and the
-- primary key is the pair (tx,line), so reusing either would raise a UNIQUE
-- constraint error.
-- The final query is Q312 without its HAVING clause, so it reports every
-- transaction. All three now net to 0, which is the assertion.
INSERT INTO ledger
VALUES (3, 3, 'suspense', 0, 5);
SELECT tx,
       SUM(debit - credit) AS discrepancy
FROM ledger
GROUP BY tx
ORDER BY tx;

BEGIN; UPDATE accounts SET balance=balance-20 WHERE id=1; UPDATE accounts SET balance=balance+20 WHERE id=2; COMMIT; SELECT id,balance FROM accounts ORDER BY id;

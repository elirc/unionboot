SAVEPOINT batch; UPDATE accounts SET balance=balance+5; RELEASE batch; SELECT id,balance FROM accounts ORDER BY id;

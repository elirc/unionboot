BEGIN; SAVEPOINT inner_step; UPDATE accounts SET balance=balance+30 WHERE id=2; RELEASE inner_step; ROLLBACK; SELECT id,balance FROM accounts ORDER BY id;

-- Why this works:
-- The transfer and its audit note are in one transaction, so the log entry
-- cannot exist without the movement it describes.
-- audit.id is INTEGER PRIMARY KEY, a rowid alias, so the INSERT lists only
-- (note) and lets SQLite assign the id.
-- In the graded SELECT, (SELECT COUNT(*) FROM audit) is an uncorrelated
-- scalar subquery: it does not mention the outer row, so SQLite evaluates
-- it once and repeats the same 1 next to each account.
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
INSERT INTO audit(note) VALUES('transfer:10');
COMMIT;
SELECT id,
       balance,
       (SELECT COUNT(*) FROM audit) AS audit_count
FROM accounts
ORDER BY id;

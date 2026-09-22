CREATE INDEX normalized ON users(lower(email));DROP INDEX normalized;SELECT COUNT(*) AS users,(SELECT COUNT(*) FROM sqlite_schema WHERE type='index' AND name='normalized') AS indexes FROM users;

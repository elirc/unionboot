BEGIN;ALTER TABLE customers ADD COLUMN tier TEXT DEFAULT 'basic';PRAGMA user_version=2;COMMIT;SELECT user_version AS version,(SELECT COUNT(*) FROM customers) AS customers FROM pragma_user_version;

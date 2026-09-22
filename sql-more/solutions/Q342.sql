ALTER TABLE customers RENAME COLUMN full_name TO display_name;SELECT id,display_name FROM customers ORDER BY id;

ALTER TABLE customers ADD COLUMN tier TEXT NOT NULL DEFAULT 'basic';SELECT id,tier FROM customers ORDER BY id;

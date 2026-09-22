BEGIN;UPDATE prices SET valid_to=10 WHERE sku='A' AND valid_to IS NULL;INSERT INTO prices VALUES('A',10,NULL,18);COMMIT;SELECT valid_from,valid_to,price FROM prices WHERE sku='A' ORDER BY valid_from;

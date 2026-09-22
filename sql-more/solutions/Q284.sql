SELECT p.sku,p.price FROM prices p WHERE p.valid_from=(SELECT MAX(x.valid_from) FROM prices x WHERE x.sku=p.sku AND x.valid_from<=6) ORDER BY p.sku;

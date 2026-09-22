SELECT id FROM bookings WHERE start<=9 AND (end>9 OR end IS NULL) ORDER BY id;

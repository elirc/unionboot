SELECT id FROM bookings WHERE start<=8 AND (end>=4 OR end IS NULL) ORDER BY id;

SELECT id,MAX(0,MIN(COALESCE(end,6),6)-MAX(start,2)) AS duration FROM bookings ORDER BY id;

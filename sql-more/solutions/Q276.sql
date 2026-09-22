SELECT a.id AS before,b.id AS after FROM bookings a JOIN bookings b ON a.end=b.start WHERE a.end>a.start AND (b.end>b.start OR b.end IS NULL) ORDER BY a.id,b.id;

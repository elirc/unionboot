SELECT ROUND((julianday(b.happened_at)-julianday(a.happened_at))*24,2) AS hours FROM events a CROSS JOIN events b WHERE a.id=1 AND b.id=2;

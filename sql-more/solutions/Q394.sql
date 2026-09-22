SELECT DISTINCT v.user FROM events v JOIN events b ON b.user=v.user AND b.kind='buy' AND b.t>v.t AND b.t-v.t<=3 WHERE v.kind='view' ORDER BY v.user;

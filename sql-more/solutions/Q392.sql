SELECT DISTINCT v.user FROM events v JOIN events c ON c.user=v.user AND c.kind='cart' AND c.t>v.t JOIN events b ON b.user=v.user AND b.kind='buy' AND b.t>c.t WHERE v.kind='view' ORDER BY v.user;

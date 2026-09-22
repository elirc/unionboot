SELECT b.id,(SELECT MAX(v.t) FROM events v WHERE v.user=b.user AND v.kind='view' AND v.t<b.t) AS view_at FROM events b WHERE b.kind='buy' ORDER BY b.id;

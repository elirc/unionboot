SELECT id,CAST(julianday('2024-03-04')-julianday(date(happened_at)) AS INTEGER) AS age_days FROM events WHERE date(happened_at)<='2024-03-04' ORDER BY id;

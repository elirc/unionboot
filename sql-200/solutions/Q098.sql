SELECT id,date(happened_at,'-'||((CAST(strftime('%w',happened_at) AS INTEGER)+6)%7)||' days') AS week_start FROM events ORDER BY id;

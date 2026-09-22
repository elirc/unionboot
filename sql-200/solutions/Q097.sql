SELECT id,strftime('%w',happened_at) AS weekday FROM events WHERE strftime('%w',happened_at) IN('0','6') ORDER BY id;

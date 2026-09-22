SELECT id,date(happened_at,'+2 hours') AS local_day FROM events ORDER BY id;

SELECT id,date(happened_at,'start of month','+1 month','-1 day') AS month_end FROM events ORDER BY id;

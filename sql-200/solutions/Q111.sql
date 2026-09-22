SELECT id,CASE WHEN priority=1 THEN 'urgent' WHEN priority=2 THEN 'normal' WHEN priority=3 THEN 'low' ELSE 'unknown' END AS band FROM tickets ORDER BY id;

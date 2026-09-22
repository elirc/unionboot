SELECT queue,COUNT(CASE WHEN state='done' THEN 1 END) AS done FROM jobs GROUP BY queue ORDER BY queue;

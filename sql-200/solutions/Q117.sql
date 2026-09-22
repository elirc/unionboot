SELECT id,CASE WHEN hours IS NULL THEN 'unestimated' WHEN hours=0 THEN 'none' WHEN hours<=3 THEN 'small' ELSE 'large' END AS size FROM tickets ORDER BY id;

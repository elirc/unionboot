SELECT lower(email) AS email,COUNT(*) AS copies FROM raw WHERE email IS NOT NULL GROUP BY lower(email) HAVING COUNT(*)>1 ORDER BY email;

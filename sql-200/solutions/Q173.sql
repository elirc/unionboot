SELECT lower(email) AS email,MIN(id) AS first_id FROM raw GROUP BY lower(email) ORDER BY email;

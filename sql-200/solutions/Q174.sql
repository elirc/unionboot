DELETE FROM raw WHERE id NOT IN(SELECT MIN(id) FROM raw GROUP BY lower(email)); SELECT id,email FROM raw ORDER BY id;

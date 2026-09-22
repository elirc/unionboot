SELECT COUNT(*)-(SELECT COUNT(*) FROM (SELECT lower(email) FROM raw GROUP BY lower(email))) AS duplicate_count,COUNT(*) AS total_rows FROM raw;

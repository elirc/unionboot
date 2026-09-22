SELECT strftime('%Y-%m',happened_at) AS month,COUNT(*) AS events FROM events GROUP BY month ORDER BY month;

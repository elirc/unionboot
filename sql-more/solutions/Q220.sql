SELECT j.value AS tag,COUNT(*) AS occurrences,COUNT(DISTINCT b.id) AS baskets FROM baskets b,json_each(b.body,'$.tags') j GROUP BY j.value ORDER BY tag;

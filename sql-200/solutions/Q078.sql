SELECT DISTINCT name,'spring' AS source FROM spring WHERE name IS NOT NULL UNION ALL SELECT DISTINCT name,'autumn' AS source FROM autumn WHERE name IS NOT NULL ORDER BY name,source;

SELECT n.name,COUNT(e.src) AS degree FROM nodes n LEFT JOIN edges e ON e.dst=n.name GROUP BY n.name ORDER BY n.name;

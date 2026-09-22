SELECT n.name,COUNT(e.dst) AS degree FROM nodes n LEFT JOIN edges e ON e.src=n.name GROUP BY n.name ORDER BY n.name;

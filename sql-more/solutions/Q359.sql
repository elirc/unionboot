WITH RECURSIVE closure(src,dst) AS(SELECT src,dst FROM edges UNION SELECT c.src,e.dst FROM closure c JOIN edges e ON e.src=c.dst) SELECT src AS node FROM closure WHERE src=dst ORDER BY node;

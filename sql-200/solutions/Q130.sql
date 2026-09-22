CREATE TABLE optional_scores(id INTEGER PRIMARY KEY,score INTEGER CHECK(score>=0)); INSERT INTO optional_scores VALUES(1,NULL),(2,0); SELECT id,score FROM optional_scores ORDER BY id;

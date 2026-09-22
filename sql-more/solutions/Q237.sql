CREATE TABLE records(id INTEGER PRIMARY KEY,body TEXT,qty INTEGER AS(json_extract(body,'$.qty')));INSERT INTO records(id,body) VALUES(1,'{"qty":2}'),(2,'{}');SELECT id,qty FROM records ORDER BY id;

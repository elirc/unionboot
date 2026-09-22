CREATE TABLE calc(id INTEGER PRIMARY KEY,qty INTEGER,price INTEGER,total INTEGER AS(qty*price));INSERT INTO calc(id,qty,price) VALUES(1,2,10);SELECT id,total FROM calc;

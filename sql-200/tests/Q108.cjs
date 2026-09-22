'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE contacts(id INTEGER PRIMARY KEY,name TEXT,email TEXT,code TEXT);\nINSERT INTO contacts VALUES(1,' Ada ','ADA@EXAMPLE.COM','AB-001'),(2,'Bo','bo@work.org','AB-002'),(3,'cy','cy@example.com','XY-010'),(4,'Dee',NULL,'XY-011'),(5,'Eli','eli+tag@example.com','ZZ-100');CREATE TABLE labels(id INTEGER,label TEXT); INSERT INTO labels VALUES(1,'a_b'),(2,'axb'),(3,'_'),(4,'ab');",
  "expected": [
    {
      "id": 1,
      "label": "a_b"
    },
    {
      "id": 3,
      "label": "_"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

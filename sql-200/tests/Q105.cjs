'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE contacts(id INTEGER PRIMARY KEY,name TEXT,email TEXT,code TEXT);\nINSERT INTO contacts VALUES(1,' Ada ','ADA@EXAMPLE.COM','AB-001'),(2,'Bo','bo@work.org','AB-002'),(3,'cy','cy@example.com','XY-010'),(4,'Dee',NULL,'XY-011'),(5,'Eli','eli+tag@example.com','ZZ-100');",
  "expected": [
    {
      "id": 1,
      "compact": "AB001"
    },
    {
      "id": 2,
      "compact": "AB002"
    },
    {
      "id": 3,
      "compact": "XY010"
    },
    {
      "id": 4,
      "compact": "XY011"
    },
    {
      "id": 5,
      "compact": "ZZ100"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

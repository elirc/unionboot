'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE raw(id INTEGER PRIMARY KEY,name TEXT,email TEXT,seen_at TEXT);\nINSERT INTO raw VALUES(1,'Ada','ada@x.com','2024-01-01'),(2,'Bo','bo@x.com','2024-01-02'),(3,'ada','ada@x.com','2024-01-03'),(4,'Cy',NULL,'2024-01-04'),(5,'cy','CY@x.com','2024-01-05'),(6,'Dee','dee@x.com','2024-01-06'),(7,'dee','dee@x.com','2024-01-07');INSERT INTO raw VALUES(8,'Bo','bo@x.com','2024-01-08');",
  "expected": [
    {
      "name": "Ada",
      "email": "ada@x.com"
    },
    {
      "name": "Bo",
      "email": "bo@x.com"
    },
    {
      "name": "Cy",
      "email": null
    },
    {
      "name": "Dee",
      "email": "dee@x.com"
    },
    {
      "name": "ada",
      "email": "ada@x.com"
    },
    {
      "name": "cy",
      "email": "CY@x.com"
    },
    {
      "name": "dee",
      "email": "dee@x.com"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

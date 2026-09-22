'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE raw(id INTEGER PRIMARY KEY,name TEXT,email TEXT,seen_at TEXT);\nINSERT INTO raw VALUES(1,'Ada','ada@x.com','2024-01-01'),(2,'Bo','bo@x.com','2024-01-02'),(3,'ada','ada@x.com','2024-01-03'),(4,'Cy',NULL,'2024-01-04'),(5,'cy','CY@x.com','2024-01-05'),(6,'Dee','dee@x.com','2024-01-06'),(7,'dee','dee@x.com','2024-01-07');",
  "expected": [
    {
      "id": 1,
      "email": "ada@x.com"
    },
    {
      "id": 2,
      "email": "bo@x.com"
    },
    {
      "id": 3,
      "email": "ada@x.com"
    },
    {
      "id": 5,
      "email": "CY@x.com"
    },
    {
      "id": 6,
      "email": "dee@x.com"
    },
    {
      "id": 7,
      "email": "dee@x.com"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE tickets(id INTEGER PRIMARY KEY,team TEXT,status TEXT,hours INTEGER,priority INTEGER);\nINSERT INTO tickets VALUES(1,'A','open',2,1),(2,'A','closed',5,3),(3,'A','open',NULL,2),(4,'B','closed',3,1),(5,'B','pending',4,NULL),(6,'B','open',0,3);",
  "expected": [
    {
      "id": 1,
      "band": "urgent"
    },
    {
      "id": 2,
      "band": "low"
    },
    {
      "id": 3,
      "band": "normal"
    },
    {
      "id": 4,
      "band": "urgent"
    },
    {
      "id": 5,
      "band": "unknown"
    },
    {
      "id": 6,
      "band": "low"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

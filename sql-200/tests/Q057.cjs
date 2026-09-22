'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE readings(id INTEGER PRIMARY KEY,sensor TEXT,day INTEGER,value INTEGER);\nINSERT INTO readings VALUES(1,'A',1,10),(2,'A',2,20),(3,'A',2,30),(4,'A',4,40),(5,'B',1,5),(6,'B',3,15);",
  "expected": [
    {
      "id": 1,
      "average": 15
    },
    {
      "id": 2,
      "average": 20
    },
    {
      "id": 3,
      "average": 30
    },
    {
      "id": 4,
      "average": 35
    },
    {
      "id": 5,
      "average": 10
    },
    {
      "id": 6,
      "average": 10
    }
  ]
};
module.exports=sql=>grade(sql,spec);

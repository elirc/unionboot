'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE measures(id INTEGER PRIMARY KEY,a INTEGER,b INTEGER,label TEXT);\nINSERT INTO measures VALUES(1,10,2,'ok'),(2,NULL,2,NULL),(3,5,0,''),(4,NULL,NULL,'missing'),(5,0,0,'zero'),(6,3,NULL,NULL);\nCREATE TABLE excluded(value INTEGER); INSERT INTO excluded VALUES(5),(NULL);",
  "expected": [
    {
      "id": 1,
      "truth": 1
    },
    {
      "id": 2,
      "truth": 1
    },
    {
      "id": 3,
      "truth": 1
    },
    {
      "id": 4,
      "truth": null
    },
    {
      "id": 5,
      "truth": 0
    },
    {
      "id": 6,
      "truth": null
    }
  ]
};
module.exports=sql=>grade(sql,spec);

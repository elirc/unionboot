'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE visits(id INTEGER PRIMARY KEY,day INTEGER);\nINSERT INTO visits VALUES(1,1),(2,2),(3,4),(4,5),(5,6),(6,9);\nCREATE TABLE battery(id INTEGER PRIMARY KEY,level INTEGER);\nINSERT INTO battery VALUES(1,80),(2,60),(3,50),(4,50),(5,55),(6,54),(7,54),(8,70);",
  "expected": [
    {
      "id": 1,
      "level": 80
    },
    {
      "id": 2,
      "level": 60
    },
    {
      "id": 3,
      "level": 50
    },
    {
      "id": 5,
      "level": 55
    },
    {
      "id": 6,
      "level": 54
    },
    {
      "id": 8,
      "level": 70
    }
  ]
};
module.exports=sql=>grade(sql,spec);

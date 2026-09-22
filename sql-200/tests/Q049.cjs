'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE scores(id INTEGER PRIMARY KEY,team TEXT,name TEXT,score INTEGER);\nINSERT INTO scores VALUES(1,'A','Ada',100),(2,'A','Bo',90),(3,'A','Cy',90),(4,'A','Dee',70),(5,'B','Eli',80),(6,'B','Flo',80),(7,'B','Gus',60);",
  "expected": [
    {
      "team": "A",
      "name": "Bo",
      "score": 90
    },
    {
      "team": "A",
      "name": "Cy",
      "score": 90
    },
    {
      "team": "B",
      "name": "Gus",
      "score": 60
    }
  ]
};
module.exports=sql=>grade(sql,spec);

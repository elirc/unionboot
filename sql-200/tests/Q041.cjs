'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE scores(id INTEGER PRIMARY KEY,team TEXT,name TEXT,score INTEGER);\nINSERT INTO scores VALUES(1,'A','Ada',100),(2,'A','Bo',90),(3,'A','Cy',90),(4,'A','Dee',70),(5,'B','Eli',80),(6,'B','Flo',80),(7,'B','Gus',60);",
  "expected": [
    {
      "team": "A",
      "name": "Ada",
      "place": 1
    },
    {
      "team": "A",
      "name": "Bo",
      "place": 2
    },
    {
      "team": "A",
      "name": "Cy",
      "place": 3
    },
    {
      "team": "A",
      "name": "Dee",
      "place": 4
    },
    {
      "team": "B",
      "name": "Eli",
      "place": 1
    },
    {
      "team": "B",
      "name": "Flo",
      "place": 2
    },
    {
      "team": "B",
      "name": "Gus",
      "place": 3
    }
  ]
};
module.exports=sql=>grade(sql,spec);

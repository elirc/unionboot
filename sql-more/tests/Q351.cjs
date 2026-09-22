'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE edges(src TEXT,dst TEXT,cost INTEGER,PRIMARY KEY(src,dst));INSERT INTO edges VALUES('A','B',2),('A','C',5),('B','C',1),('B','D',4),('C','D',1),('D','B',1);CREATE TABLE nodes(name TEXT PRIMARY KEY);INSERT INTO nodes VALUES('A'),('B'),('C'),('D'),('E');",
  "expected": [
    {
      "name": "A",
      "degree": 2
    },
    {
      "name": "B",
      "degree": 2
    },
    {
      "name": "C",
      "degree": 1
    },
    {
      "name": "D",
      "degree": 1
    },
    {
      "name": "E",
      "degree": 0
    }
  ]
};
module.exports=sql=>grade(sql,spec);

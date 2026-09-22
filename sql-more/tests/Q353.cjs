'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE edges(src TEXT,dst TEXT,cost INTEGER,PRIMARY KEY(src,dst));INSERT INTO edges VALUES('A','B',2),('A','C',5),('B','C',1),('B','D',4),('C','D',1),('D','B',1);CREATE TABLE nodes(name TEXT PRIMARY KEY);INSERT INTO nodes VALUES('A'),('B'),('C'),('D'),('E');",
  "expected": [
    {
      "via": "B",
      "destination": "C",
      "cost": 3
    },
    {
      "via": "B",
      "destination": "D",
      "cost": 6
    },
    {
      "via": "C",
      "destination": "D",
      "cost": 6
    }
  ]
};
module.exports=sql=>grade(sql,spec);

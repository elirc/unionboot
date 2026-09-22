'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE local(key TEXT PRIMARY KEY,value INTEGER);CREATE TABLE remote(key TEXT PRIMARY KEY,value INTEGER);INSERT INTO local VALUES('A',10),('B',20),('C',NULL),('D',4);INSERT INTO remote VALUES('A',10),('B',25),('C',NULL),('E',5);",
  "expected": [
    {
      "key": "A",
      "value": 10
    },
    {
      "key": "B",
      "value": 25
    },
    {
      "key": "C",
      "value": null
    },
    {
      "key": "E",
      "value": 5
    }
  ]
};
module.exports=sql=>grade(sql,spec);

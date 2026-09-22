'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE source(id INTEGER PRIMARY KEY,qty INTEGER,price INTEGER,discount INTEGER);INSERT INTO source VALUES(1,2,10,3),(2,0,8,0),(3,3,7,2);",
  "expected": [
    {
      "name": "v",
      "hidden": 2
    },
    {
      "name": "s",
      "hidden": 3
    }
  ]
};
module.exports=sql=>grade(sql,spec);

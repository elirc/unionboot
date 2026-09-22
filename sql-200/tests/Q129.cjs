'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "id": 1,
      "value": 7
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO amounts VALUES(2,'seven')",
      "reject": "cannot store TEXT"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "id": 1,
      "status": "draft",
      "enabled": 0
    },
    {
      "id": 2,
      "status": "live",
      "enabled": 1
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO flags VALUES(3,'other',0)",
      "reject": "CHECK"
    },
    {
      "sql": "INSERT INTO flags VALUES(3,'draft',2)",
      "reject": "CHECK"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

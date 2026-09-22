'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "sku": "A",
      "qty": 0
    },
    {
      "sku": "B",
      "qty": 3
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO stock VALUES('C',-1)",
      "reject": "CHECK"
    },
    {
      "sql": "INSERT INTO stock VALUES('C',NULL)",
      "reject": "NOT NULL"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

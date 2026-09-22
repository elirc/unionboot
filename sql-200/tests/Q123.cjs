'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "id": 1,
      "email": "Ada@x"
    },
    {
      "id": 2,
      "email": "ada@x"
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO users VALUES(3,'Ada@x')",
      "reject": "UNIQUE"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "user_id": 1,
      "team_id": 10,
      "role": "reader"
    },
    {
      "user_id": 1,
      "team_id": 20,
      "role": "writer"
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO membership VALUES(1,10,'owner')",
      "reject": "UNIQUE"
    },
    {
      "sql": "INSERT INTO membership VALUES(NULL,10,'owner')",
      "reject": "NOT NULL"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

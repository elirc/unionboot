'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "id": 1,
      "dept_id": 10
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO workers VALUES(2,99)",
      "reject": "FOREIGN KEY"
    },
    {
      "sql": "DELETE FROM departments WHERE id=10",
      "reject": "FOREIGN KEY"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "id": 2,
      "dept_id": 20
    }
  ],
  "probes": [
    {
      "sql": "DELETE FROM departments WHERE id=20; SELECT COUNT(*) AS remaining FROM workers",
      "expected": [
        {
          "remaining": 0
        }
      ]
    }
  ]
};
module.exports=sql=>grade(sql,spec);

'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "id": 1,
      "score": null
    },
    {
      "id": 2,
      "score": 0
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO optional_scores VALUES(3,-1)",
      "reject": "CHECK"
    },
    {
      "sql": "INSERT INTO optional_scores VALUES(3,NULL); SELECT score FROM optional_scores WHERE id=3",
      "expected": [
        {
          "score": null
        }
      ]
    }
  ]
};
module.exports=sql=>grade(sql,spec);

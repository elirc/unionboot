'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE departments(id INTEGER PRIMARY KEY); INSERT INTO departments VALUES(10),(20);",
  "expected": [
    {
      "id": 1,
      "name": "One"
    }
  ],
  "probes": [
    {
      "sql": "INSERT INTO items(name) VALUES(NULL)",
      "reject": "NOT NULL"
    },
    {
      "sql": "SELECT rowid,id FROM items",
      "expected": [
        {
          "id": 1
        }
      ]
    }
  ]
};
module.exports=sql=>grade(sql,spec);

'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE events(id INTEGER PRIMARY KEY,happened_at TEXT);\nINSERT INTO events VALUES(1,'2024-02-28 23:30:00'),(2,'2024-02-29 00:30:00'),(3,'2024-03-01 12:00:00'),(4,'2024-03-03 09:00:00'),(5,'2024-12-31 23:00:00');",
  "expected": [
    {
      "month": "2024-02",
      "events": 2
    },
    {
      "month": "2024-03",
      "events": 2
    },
    {
      "month": "2024-12",
      "events": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);

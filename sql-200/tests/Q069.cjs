'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE staff(id INTEGER PRIMARY KEY,name TEXT,manager_id INTEGER);\nINSERT INTO staff VALUES(1,'Ada',NULL),(2,'Bo',1),(3,'Cy',1),(4,'Dee',2),(5,'Eli',2),(6,'Flo',4);\nCREATE TABLE edges(src INTEGER,dst INTEGER);\nINSERT INTO edges VALUES(1,2),(2,3),(3,1),(2,4);CREATE TABLE events(id INTEGER,day TEXT); INSERT INTO events VALUES(1,'2024-01-01'),(2,'2024-01-01'),(3,'2024-01-03');",
  "expected": [
    {
      "day": "2024-01-01",
      "events": 2
    },
    {
      "day": "2024-01-02",
      "events": 0
    },
    {
      "day": "2024-01-03",
      "events": 1
    },
    {
      "day": "2024-01-04",
      "events": 0
    }
  ]
};
module.exports=sql=>grade(sql,spec);

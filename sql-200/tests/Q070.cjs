'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE staff(id INTEGER PRIMARY KEY,name TEXT,manager_id INTEGER);\nINSERT INTO staff VALUES(1,'Ada',NULL),(2,'Bo',1),(3,'Cy',1),(4,'Dee',2),(5,'Eli',2),(6,'Flo',4);\nCREATE TABLE edges(src INTEGER,dst INTEGER);\nINSERT INTO edges VALUES(1,2),(2,3),(3,1),(2,4);",
  "expected": [
    {
      "name": "Ada",
      "descendants": 5
    },
    {
      "name": "Bo",
      "descendants": 3
    },
    {
      "name": "Dee",
      "descendants": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);

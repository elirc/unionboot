'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE people(id INTEGER PRIMARY KEY, name TEXT NOT NULL, team_id INTEGER);\nCREATE TABLE teams(id INTEGER PRIMARY KEY, label TEXT NOT NULL);\nINSERT INTO people VALUES(1,'Ada',10),(2,'Bo',10),(3,'Cy',20),(4,'Dee',NULL),(5,'Eli',99);\nINSERT INTO teams VALUES(10,'Blue'),(20,'Gold'),(30,'Red');",
  "expected": [
    {
      "first": "Ada",
      "second": "Bo"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

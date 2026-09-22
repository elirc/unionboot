'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE spring(name TEXT); CREATE TABLE autumn(name TEXT);\nINSERT INTO spring VALUES('Ada'),('Bo'),('Bo'),('Cy'),(NULL);\nINSERT INTO autumn VALUES('Bo'),('Dee'),(NULL),(NULL);",
  "expected": [
    {
      "name": null,
      "occurrences": 3
    },
    {
      "name": "Ada",
      "occurrences": 1
    },
    {
      "name": "Bo",
      "occurrences": 3
    },
    {
      "name": "Cy",
      "occurrences": 1
    },
    {
      "name": "Dee",
      "occurrences": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);

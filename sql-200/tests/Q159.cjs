'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE tasks(id INTEGER PRIMARY KEY,owner TEXT,status TEXT,points INTEGER);\nCREATE TABLE blocked(owner TEXT); CREATE TABLE adjustments(owner TEXT,delta INTEGER);\nINSERT INTO tasks VALUES(1,'Ada','open',3),(2,'Ada','done',5),(3,'Bo','open',2),(4,'Cy','open',4),(5,'Cy','done',1),(6,'Dee','open',NULL);\nINSERT INTO blocked VALUES('Bo'),(NULL); INSERT INTO adjustments VALUES('Ada',2),('Cy',-1);",
  "expected": [
    {
      "id": 1,
      "owner": "Ada"
    },
    {
      "id": 2,
      "owner": "Ada"
    },
    {
      "id": 4,
      "owner": "Cy"
    },
    {
      "id": 5,
      "owner": "Cy"
    }
  ]
};
module.exports=sql=>grade(sql,spec);

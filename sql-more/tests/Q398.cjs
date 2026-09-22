'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE events(id INTEGER PRIMARY KEY,user TEXT,kind TEXT,t INTEGER);INSERT INTO events VALUES(1,'A','view',1),(2,'A','cart',2),(3,'A','buy',4),(4,'B','buy',1),(5,'B','view',2),(6,'B','cart',3),(7,'C','view',1),(8,'C','cart',5),(9,'C','buy',9),(10,'D','view',1),(11,'D','buy',3),(12,'A','buy',6);",
  "expected": [
    {
      "id": 3,
      "view_at": 1
    },
    {
      "id": 4,
      "view_at": null
    },
    {
      "id": 9,
      "view_at": 1
    },
    {
      "id": 11,
      "view_at": 1
    },
    {
      "id": 12,
      "view_at": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);

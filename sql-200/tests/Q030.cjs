'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE sales(id INTEGER PRIMARY KEY,region TEXT,amount INTEGER,status TEXT);\nINSERT INTO sales VALUES(1,'East',10,'paid'),(2,'East',20,'paid'),(3,'East',100,'pending'),(4,'West',5,'paid'),(5,'West',NULL,'paid'),(6,'North',40,'paid'),(7,'North',-10,'refund'),(8,'South',NULL,'pending');",
  "expected": [
    {
      "region": "East",
      "status": "paid",
      "entries": 2,
      "total": 30
    },
    {
      "region": "East",
      "status": "pending",
      "entries": 1,
      "total": 100
    },
    {
      "region": "North",
      "status": "paid",
      "entries": 1,
      "total": 40
    },
    {
      "region": "North",
      "status": "refund",
      "entries": 1,
      "total": -10
    },
    {
      "region": "South",
      "status": "pending",
      "entries": 1,
      "total": 0
    },
    {
      "region": "West",
      "status": "paid",
      "entries": 2,
      "total": 5
    }
  ]
};
module.exports=sql=>grade(sql,spec);

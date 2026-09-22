'use strict';
// One shared test for starter and reference; the candidate SQL is the only difference.
const grade=require('../runtime.cjs');
const spec={
  "seed": "\nCREATE TABLE accounts(id INTEGER PRIMARY KEY,balance INTEGER NOT NULL CHECK(balance>=0));\nINSERT INTO accounts VALUES(1,100),(2,50);\nCREATE TABLE audit(id INTEGER PRIMARY KEY,note TEXT);",
  "expected": [
    {
      "id": 1,
      "balance": 90,
      "audit_count": 1
    },
    {
      "id": 2,
      "balance": 60,
      "audit_count": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);

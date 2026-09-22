'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE users(id INTEGER PRIMARY KEY,joined INTEGER);CREATE TABLE activity(user_id INTEGER,day INTEGER);INSERT INTO users VALUES(1,0),(2,0),(3,1),(4,1);INSERT INTO activity VALUES(1,0),(1,1),(1,1),(1,3),(2,0),(3,1),(3,2);",
  "expected": [
    {
      "cohort": 0,
      "age": 0,
      "active": 2
    },
    {
      "cohort": 0,
      "age": 1,
      "active": 1
    },
    {
      "cohort": 0,
      "age": 3,
      "active": 1
    },
    {
      "cohort": 1,
      "age": 0,
      "active": 1
    },
    {
      "cohort": 1,
      "age": 1,
      "active": 1
    }
  ]
};
module.exports=sql=>grade(sql,spec);

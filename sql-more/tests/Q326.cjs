'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE users(id INTEGER PRIMARY KEY,joined INTEGER);CREATE TABLE activity(user_id INTEGER,day INTEGER);INSERT INTO users VALUES(1,0),(2,0),(3,1),(4,1);INSERT INTO activity VALUES(1,0),(1,1),(1,1),(1,3),(2,0),(3,1),(3,2);",
  "expected": [
    {
      "id": 4
    }
  ]
};
module.exports=sql=>grade(sql,spec);

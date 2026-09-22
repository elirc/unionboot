'use strict';
// Identical seed/assertions for reference and learner SQL.
const grade=require('../runtime.cjs');
const spec={
  "seed": "CREATE TABLE bookings(id INTEGER PRIMARY KEY,start INTEGER,end INTEGER);INSERT INTO bookings VALUES(1,1,4),(2,4,7),(3,3,5),(4,8,NULL),(5,6,6);",
  "expected": [
    {
      "id": 5
    }
  ]
};
module.exports=sql=>grade(sql,spec);
